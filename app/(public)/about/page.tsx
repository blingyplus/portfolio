// app/(public)/about/page.tsx
// Server component: renders the About content into the initial HTML for search engines
// and link previews, then hands it to the client component. Metadata lives in layout.tsx.
import AboutClient from "./AboutClient";
import { getAbout } from "@/app/lib/content";

// Refresh content from Appwrite at most every 5 minutes (must be a literal for Next.js).
export const revalidate = 300;

export default async function AboutPage() {
  const about = await getAbout();
  return <AboutClient initialAbout={about} />;
}
