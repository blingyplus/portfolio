//syncModels.mjs
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

// Initialize API endpoint and project details
const endpoint = 'https://cloud.appwrite.io/v1';
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;


// Helper to make API requests
async function makeApiRequest(path, method, body) {
    const requestUrl = `${endpoint}${path}`;
    console.log('Request URL:', requestUrl);

    const response = await fetch(requestUrl, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const responseText = await response.text();
    console.log('Raw Response:', responseText); 

    try {
        if (response.ok) {
            return JSON.parse(responseText);
        } else {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        throw new Error('Failed to parse JSON response: ' + error.message);
    }
}

// Create a collection
async function createCollection(collectionId, name) {
    const payload = {
        collectionId,
        name,
        permissions: [], // Add permissions if needed
        documentSecurity: true,
    };
    return makeApiRequest(`/databases/${databaseId}/collections`, 'POST', payload);
}

// Add string attribute to a collection
async function addStringAttribute(collectionId, key, size) {
    const path = `/databases/${databaseId}/collections/${collectionId}/attributes/string`;
    const payload = {
        key,
        required: false,
        size, // Ensure size is correctly provided
    };
    return makeApiRequest(path, 'POST', payload);
}

// Add integer attribute to a collection
async function addIntegerAttribute(collectionId, key, size) {
    const path = `/databases/${databaseId}/collections/${collectionId}/attributes/integer`;
    const payload = {
        key,
        required: false,
        size, // Ensure size is included (for any constraints you may want)
    };
    return makeApiRequest(path, 'POST', payload);
}

// Add datetime attribute to a collection
async function addDatetimeAttribute(collectionId, key) {
    const path = `/databases/${databaseId}/collections/${collectionId}/attributes/datetime`;
    const payload = {
        key,
        required: false,
    };
    return makeApiRequest(path, 'POST', payload);
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
    return makeApiRequest(path, 'POST', payload);
}

// Sync the collections and their attributes
async function syncModels() {
    try {
        // Create Projects Collection
        await createCollection('projects', 'Projects');
        await addStringAttribute('projects', 'title', 255);
        await addStringAttribute('projects', 'description', 5000);
        await addStringAttribute('projects', 'imageUrl', 255);
        await addStringAttribute('projects', 'projectUrl', 255);
        await addStringArrayAttribute('projects', 'technologies', 255);
        await addIntegerAttribute('projects', 'order', 10);

        // Create BlogPosts Collection
        await createCollection('blogposts', 'BlogPosts');
        await addStringAttribute('blogposts', 'title', 255);
        await addStringAttribute('blogposts', 'content', 10000);
        await addStringAttribute('blogposts', 'slug', 255);
        await addDatetimeAttribute('blogposts', 'publishDate');
        await addStringArrayAttribute('blogposts', 'tags', 255);

        // Create About Collection
        await createCollection('about', 'About');
        await addStringAttribute('about', 'content', 5000);
        await addStringArrayAttribute('about', 'skills', 255);
        await addStringAttribute('about', 'resumeUrl', 255);

        console.log('Collections and attributes synced successfully');
    } catch (error) {
        console.error('Error syncing models:', error);
    }
}

// Run sync script
syncModels();
