import { API_KEY } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

//api route to get shallow details i.e description, image, episode numbers for a season etc

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const mediaType = searchParams.get("mediaType"); //tv | movie

    let response;

    if (mediaType === "tv") {
      response = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    } else if (mediaType === "movie") {
      response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    } else {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
