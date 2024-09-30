import { NextResponse } from 'next/server';
import { databases } from '../../lib/appwrite';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export async function GET() {
    try {
        const collections = ['Projects', 'BlogPosts', 'About'];
        const existingCollections = await Promise.all(
            collections.map(async (collectionId) => {
                try {
                    await databases.listDocuments(databaseId, collectionId);
                    return collectionId;
                } catch {
                    return null;
                }
            })
        );

        const missingCollections = collections.filter(
            (col) => !existingCollections.includes(col)
        );

        if (missingCollections.length > 0) {
            return NextResponse.json(
                { error: `Missing collections: ${missingCollections.join(', ')}` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'All required Appwrite collections exist' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking Appwrite collections:', error);
        return NextResponse.json(
            { error: 'Failed to check Appwrite collections' },
            { status: 500 }
        );
    }
}