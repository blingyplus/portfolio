// app/lib/appwrite.ts
import { Client, Account, Databases, Storage, ID } from "appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export { client };

export async function createOrUpdateDocument(collectionId: string, documentId: string | null, data: Record<string, unknown>) {
  if (documentId) {
    return await databases.updateDocument(databaseId, collectionId, documentId, data);
  } else {
    return await databases.createDocument(databaseId, collectionId, ID.unique(), data);
  }
}

export async function getDocuments(collectionId: string) {
  const response = await databases.listDocuments(databaseId, collectionId);
  return response.documents;
}

export async function deleteDocument(collectionId: string, documentId: string) {
  await databases.deleteDocument(databaseId, collectionId, documentId);
}

export async function uploadImage(file: File) {
  const uploadedFile = await storage.createFile(bucketId, ID.unique(), file);
  return storage.getFileView(bucketId, uploadedFile.$id);
}

export const projectsCollection = {
  create: async (data: Record<string, unknown>, imageFile?: File) => {
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      data.imageUrl = imageUrl.href;
    }
    return createOrUpdateDocument("Projects", null, data);
  },
  update: async (id: string, data: Record<string, unknown>, imageFile?: File) => {
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      data.imageUrl = imageUrl.href;
    }
    return createOrUpdateDocument("Projects", id, data);
  },
  getAll: () => getDocuments("Projects"),
  delete: (id: string) => deleteDocument("Projects", id),
};

export const blogPostsCollection = {
  create: (data: Record<string, unknown>) => createOrUpdateDocument("BlogPosts", null, data),
  update: (id: string, data: Record<string, unknown>) => createOrUpdateDocument("BlogPosts", id, data),
  getAll: () => getDocuments("BlogPosts"),
  delete: (id: string) => deleteDocument("BlogPosts", id),
};

export const aboutCollection = {
  create: (data: Record<string, unknown>) => createOrUpdateDocument("About", null, data),
  update: (id: string, data: Record<string, unknown>) => createOrUpdateDocument("About", id, data),
  get: async () => {
    const docs = await getDocuments("About");
    return docs[0] || null;
  },
};

// Authentication methods
export async function createAccount(email: string, password: string, name: string) {
  return await account.create(ID.unique(), email, password, name);
}

export async function login(email: string, password: string) {
  return await account.createEmailPasswordSession(email, password);
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function logout() {
  return await account.deleteSession("current");
}

export async function isAuthenticated() {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
}
