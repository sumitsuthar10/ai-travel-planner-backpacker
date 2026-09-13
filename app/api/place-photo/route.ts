import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return new NextResponse(null, { status: 404 });
  }

  const url = new URL("/api/travel-photo", req.nextUrl.origin);
  url.searchParams.set("query", query);

  return NextResponse.redirect(url);
}
