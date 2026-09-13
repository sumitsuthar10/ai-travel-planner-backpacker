import { NextRequest, NextResponse } from "next/server";

type UnsplashResponse = {
  results?: Array<{
    urls?: {
      regular?: string;
      full?: string;
    };
  }>;
};

type PexelsResponse = {
  photos?: Array<{
    src?: {
      large2x?: string;
      large?: string;
      original?: string;
    };
  }>;
};

const getUnsplashPhoto = async (query: string) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) return null;

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("client_id", accessKey);

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) return null;

  const data = (await response.json()) as UnsplashResponse;
  return data.results?.[0]?.urls?.regular ?? data.results?.[0]?.urls?.full ?? null;
};

const getPexelsPhoto = async (query: string) => {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) return null;

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");

  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as PexelsResponse;
  return (
    data.photos?.[0]?.src?.large2x ??
    data.photos?.[0]?.src?.large ??
    data.photos?.[0]?.src?.original ??
    null
  );
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")?.trim();

  if (!query) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const photoUrl = (await getUnsplashPhoto(query)) ?? (await getPexelsPhoto(query));

    if (!photoUrl) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.redirect(photoUrl, {
      status: 302,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
