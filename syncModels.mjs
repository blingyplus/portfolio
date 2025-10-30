//syncModels.mjs
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

// Load environment variables
// Attempt to load env from common Next.js patterns: .env.local then .env
function loadEnvFiles() {
  const candidates = [".env.local", ".env"];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file, override: false });
    }
  }
}

loadEnvFiles();

// Initialize API endpoint and project details
const endpoint = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const apiKey = process.env.APPWRITE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

function validateEnv() {
  const missing = [];
  if (!endpoint) missing.push("APPWRITE_ENDPOINT (or default)");
  if (!projectId) missing.push("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  if (!databaseId) missing.push("NEXT_PUBLIC_APPWRITE_DATABASE_ID");
  if (!apiKey) missing.push("APPWRITE_API_KEY");
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}.\n` + `Current endpoint: ${endpoint || "<unset>"}`);
  }
}

// Helper to make API requests
async function makeApiRequest(path, method, body) {
  const requestUrl = `${endpoint}${path}`;
  console.log("Request URL:", requestUrl);

  const response = await fetch(requestUrl, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();
  console.log("Raw Response:", responseText);

  try {
    if (response.ok) {
      return JSON.parse(responseText);
    } else {
      // include body so callers can parse server error details
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText} - ${responseText}`);
    }
  } catch (error) {
    throw new Error("Failed to parse JSON response: " + error.message);
  }
}

// Create a collection
async function createCollection(collectionId, name) {
  try {
    const existing = await getCollection(collectionId);
    if (existing && existing.$id === collectionId) {
      console.log(`Collection ${collectionId} already exists. Skipping creation.`);
      return existing;
    }
  } catch (err) {
    const message = String(err && err.message ? err.message : err);
    // If not found, proceed to create; otherwise rethrow
    if (!/404|not_found/i.test(message)) {
      console.warn(`Skipping pre-check error for ${collectionId}:`, message);
    }
  }

  const payload = {
    collectionId,
    name,
    permissions: [],
    documentSecurity: true,
  };
  try {
    return await makeApiRequest(`/databases/${databaseId}/collections`, "POST", payload);
  } catch (err) {
    const message = String(err && err.message ? err.message : err);
    if (/collection_already_exists|409/i.test(message)) {
      console.log(`Collection ${collectionId} already exists (409). Continuing.`);
      return await getCollection(collectionId);
    }
    throw err;
  }
}

// Add string attribute to a collection
async function addStringAttribute(collectionId, key, size) {
  const path = `/databases/${databaseId}/collections/${collectionId}/attributes/string`;
  const payload = {
    key,
    required: false,
    size, // Ensure size is correctly provided
  };
  return makeApiRequest(path, "POST", payload);
}

// Fetch a collection and its attributes
async function getCollection(collectionId) {
  const path = `/databases/${databaseId}/collections/${collectionId}`;
  return makeApiRequest(path, "GET");
}

// Documents helpers
async function listDocuments(collectionId, queries = []) {
  const path = `/databases/${databaseId}/collections/${collectionId}/documents`;
  const payload = queries.length ? { queries } : undefined;
  // Appwrite uses POST for complex queries; GET for basic. Use POST for safety.
  return makeApiRequest(path, "GET", payload);
}

async function updateDocument(collectionId, documentId, data) {
  const path = `/databases/${databaseId}/collections/${collectionId}/documents/${documentId}`;
  return makeApiRequest(path, "PATCH", { data });
}

// Update an existing string attribute (supports array string as well)
async function updateStringAttribute(collectionId, key, size, isArray = false) {
  const path = `/databases/${databaseId}/collections/${collectionId}/attributes/string/${key}`;
  const payload = {
    key,
    required: false,
    size,
    array: !!isArray,
  };
  return makeApiRequest(path, "PUT", payload);
}

// Ensure a string attribute exists with at least the desired size. If it exists and is smaller, try to update it.
async function ensureStringAttribute(collectionId, key, desiredSize, isArray = false) {
  try {
    const collection = await getCollection(collectionId);
    const attributes = Array.isArray(collection.attributes) ? collection.attributes : [];
    const existing = attributes.find((a) => a.key === key && a.type === "string" && !!a.array === !!isArray);

    if (!existing) {
      console.log(`Attribute ${collectionId}.${key} not found. Creating with size ${desiredSize}...`);
      return isArray ? addStringArrayAttribute(collectionId, key, desiredSize) : addStringAttribute(collectionId, key, desiredSize);
    }

    if (typeof existing.size === "number" && existing.size >= desiredSize) {
      console.log(`Attribute ${collectionId}.${key} already has size ${existing.size} (>= ${desiredSize}). Skipping update.`);
      return existing;
    }

    console.log(`Attribute ${collectionId}.${key} exists with size ${existing.size}. Attempting update to ${desiredSize}...`);
    try {
      return await updateStringAttribute(collectionId, key, desiredSize, isArray);
    } catch (err) {
      const message = String(err && err.message ? err.message : err);
      if (/general_route_not_found/i.test(message)) {
        // Server does not support updating attributes. Return a sentinel to allow fallback by caller.
        const notSupported = new Error("UPDATE_ATTRIBUTE_NOT_SUPPORTED");
        notSupported.code = "UPDATE_ATTRIBUTE_NOT_SUPPORTED";
        throw notSupported;
      }
      // Try to detect a server-declared maximum like "no longer than 5000 chars"
      const match = message.match(/no longer than\s+(\d+)\s*chars/i);
      if (match) {
        const maxAllowed = parseInt(match[1], 10);
        if (!Number.isNaN(maxAllowed) && (typeof existing.size !== "number" || existing.size < maxAllowed)) {
          console.warn(`Update to ${desiredSize} rejected. Retrying with server max ${maxAllowed}...`);
          return await updateStringAttribute(collectionId, key, maxAllowed, isArray);
        }
      }
      console.error(`Failed to update attribute ${collectionId}.${key}:`, message);
      throw err;
    }
  } catch (outerErr) {
    console.error(`ensureStringAttribute error for ${collectionId}.${key}:`, outerErr);
    throw outerErr;
  }
}

async function ensureStringArrayAttribute(collectionId, key, desiredSize) {
  return ensureStringAttribute(collectionId, key, desiredSize, true);
}

async function ensureIntegerAttribute(collectionId, key) {
  try {
    const collection = await getCollection(collectionId);
    const attributes = Array.isArray(collection.attributes) ? collection.attributes : [];
    const existing = attributes.find((a) => a.key === key && a.type === "integer");
    if (existing) {
      console.log(`Attribute ${collectionId}.${key} (integer) already exists. Skipping.`);
      return existing;
    }
  } catch (err) {
    console.warn(`Pre-check for integer attribute ${collectionId}.${key} failed, will attempt create.`);
  }
  return addIntegerAttribute(collectionId, key);
}

async function ensureDatetimeAttribute(collectionId, key) {
  try {
    const collection = await getCollection(collectionId);
    const attributes = Array.isArray(collection.attributes) ? collection.attributes : [];
    const existing = attributes.find((a) => a.key === key && a.type === "datetime");
    if (existing) {
      console.log(`Attribute ${collectionId}.${key} (datetime) already exists. Skipping.`);
      return existing;
    }
  } catch (err) {
    console.warn(`Pre-check for datetime attribute ${collectionId}.${key} failed, will attempt create.`);
  }
  return addDatetimeAttribute(collectionId, key);
}

// Add integer attribute to a collection
async function addIntegerAttribute(collectionId, key, size) {
  const path = `/databases/${databaseId}/collections/${collectionId}/attributes/integer`;
  const payload = {
    key,
    required: false,
    size, // Ensure size is included (for any constraints you may want)
  };
  return makeApiRequest(path, "POST", payload);
}

// Add datetime attribute to a collection
async function addDatetimeAttribute(collectionId, key) {
  const path = `/databases/${databaseId}/collections/${collectionId}/attributes/datetime`;
  const payload = {
    key,
    required: false,
  };
  return makeApiRequest(path, "POST", payload);
}

// Add string[] attribute to a collection
async function addStringArrayAttribute(collectionId, key, size) {
  const path = `/databases/${databaseId}/collections/${collectionId}/attributes/string`;
  const payload = {
    key,
    required: false,
    array: true,
    size,
  };
  return makeApiRequest(path, "POST", payload);
}

// Sync the collections and their attributes
async function syncModels() {
  try {
    validateEnv();
    // Create Projects Collection
    await createCollection("projects", "Projects");
    await ensureStringAttribute("projects", "title", 255);
    try {
      await ensureStringAttribute("projects", "description", 20000);
    } catch (e) {
      if (e && e.code === "UPDATE_ATTRIBUTE_NOT_SUPPORTED") {
        console.warn("Attribute updates not supported on this Appwrite version. Creating fallback attribute 'descriptionLong' and migrating data.");
        await ensureStringAttribute("projects", "descriptionLong", 20000);
        // migrate existing documents
        const docs = await listDocuments("projects");
        const documents = Array.isArray(docs.documents) ? docs.documents : [];
        for (const doc of documents) {
          const hasLong = typeof doc.descriptionLong === "string" && doc.descriptionLong.length > 0;
          const hasOld = typeof doc.description === "string" && doc.description.length > 0;
          if (!hasLong && hasOld) {
            await updateDocument("projects", doc.$id, { descriptionLong: doc.description });
          }
        }
      } else {
        throw e;
      }
    }
    // migrate images array from legacy imageUrl if needed
    try {
      const docs = await listDocuments("projects");
      const documents = Array.isArray(docs.documents) ? docs.documents : [];
      for (const doc of documents) {
        const hasImages = Array.isArray(doc.images) && doc.images.length > 0;
        const hasSingle = typeof doc.imageUrl === "string" && doc.imageUrl.length > 0;
        if (!hasImages && hasSingle) {
          await updateDocument("projects", doc.$id, { images: [doc.imageUrl] });
        }
      }
    } catch (mErr) {
      console.warn("Image array migration warning:", mErr?.message || mErr);
    }
    await ensureStringAttribute("projects", "imageUrl", 255);
    await ensureStringArrayAttribute("projects", "images", 255);
    await ensureStringAttribute("projects", "projectUrl", 255);
    await ensureStringArrayAttribute("projects", "technologies", 255);
    await ensureIntegerAttribute("projects", "order");

    // Create BlogPosts Collection
    await createCollection("blogposts", "BlogPosts");
    await ensureStringAttribute("blogposts", "title", 255);
    await ensureStringAttribute("blogposts", "content", 10000);
    await ensureStringAttribute("blogposts", "slug", 255);
    await ensureDatetimeAttribute("blogposts", "publishDate");
    await ensureStringArrayAttribute("blogposts", "tags", 255);

    // Create About Collection
    await createCollection("about", "About");
    await ensureStringAttribute("about", "content", 5000);
    await ensureStringArrayAttribute("about", "skills", 255);
    await ensureStringAttribute("about", "resumeUrl", 255);

    console.log("Collections and attributes synced successfully");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
}

// Run sync script
syncModels();
