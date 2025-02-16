import { API_KEY } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaType = searchParams.get("mediaType");
    const query = searchParams.get("query");
    const page = searchParams.get("page");

    if (!mediaType || !query || !page) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    const url = new URL(`https://api.themoviedb.org/3/search/${mediaType}`);
    url.searchParams.append("query", query);
    url.searchParams.append("language", "en-US");
    url.searchParams.append("page", page);

    const response = await fetch(url.toString(), {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "External API error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
