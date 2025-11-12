import { NextResponse } from "next/server";

import { articles } from "@/content/articles";
import { buildRssFeed } from "@/lib/rss";

export async function GET() {
  const rss = buildRssFeed(articles);

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}
