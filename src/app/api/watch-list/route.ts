import {
  addToFavourites,
  getCurrentUser,
  removeFromFavourites,
} from "@/services/watchListService";
import { NextRequest, NextResponse } from "next/server";

//returns user's favourites / watch list
export async function GET(req: NextRequest) {
  try {
    const { user, status, message } = await getCurrentUser();

    // If user is null, return early with status and message
    if (user == null) {
      return NextResponse.json({ message }, { status });
    }

    // If user is found, return the user's watch_list and message
    return NextResponse.json({ data: user.watch_list, message }, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 } // Ensure 500 status is returned as part of the HTTP response header
    );
  }
}

//adding a show to a user's favourites
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Show ID is required" },
        { status: 400 }
      );
    }

    const { status, message } = await addToFavourites(id);
    return NextResponse.json({ message }, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//removing a show from favourites
export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Show ID is required" },
        { status: 400 }
      );
    }

    const { status, message } = await removeFromFavourites(id);
    return NextResponse.json({ message }, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
