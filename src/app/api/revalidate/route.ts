import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Contentful webhook target (publish / unpublish of entries and assets).
 * Configure the webhook with a custom header: x-revalidate-secret: <CONTENTFUL_REVALIDATE_SECRET>.
 * Pages reference each other heavily (navigation, content grids, related articles),
 * so any change revalidates the whole site.
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.CONTENTFUL_REVALIDATE_SECRET || secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { sys?: { id?: string; type?: string; contentType?: { sys?: { id?: string } } } } | null;
  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
    entity: payload?.sys ? { id: payload.sys.id, type: payload.sys.type, contentType: payload.sys.contentType?.sys?.id } : null,
    now: Date.now(),
  });
}
