import { API_KEY } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

//details for an episode of a tv show

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const season = searchParams.get("season");
    const episode = searchParams.get("episode");

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

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
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
