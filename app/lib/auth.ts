import { account } from "./appwrite";

export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
}
