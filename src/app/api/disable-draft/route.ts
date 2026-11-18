import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** Turns draft mode off and sends the editor back to the page they were on. */
async function disable(request: Request) {
  (await draftMode()).disable();
  const referer = request.headers.get("referer");
  const back = referer ? new URL(referer).pathname : "/";
  return NextResponse.redirect(new URL(back, request.url), 303);
}

export const POST = disable;
export const GET = disable;
