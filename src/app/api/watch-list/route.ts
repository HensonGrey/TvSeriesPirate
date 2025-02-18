import {
  addToFavourites,
  getCurrentUser,
  removeFromFavourites,
} from "@/services/watchListService";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//returns user's favourites
export async function GET() {
  try {
    const { user, status, message } = await getCurrentUser();

    // If user is null, return early with status and message
    if (user == null) {
      return NextResponse.json({ message }, { status });
    }

    const favourites = await prisma.favourite.findMany({
      where: {
        userId: user.id,
      },
    });

    // If user is found, return the user's favourites and message
    return NextResponse.json({ data: favourites, message }, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//adding a show to a user's favourites
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { showId, showType, imagePath, showTitle } = body;

    if (!showId) {
      return NextResponse.json(
        { error: "Show ID is required" },
        { status: 400 }
      );
    }

    const { status, message } = await addToFavourites(
      showId,
      showType,
      imagePath,
      showTitle
    );
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
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { showId, showType } = body;

    if (!showId) {
      return NextResponse.json(
        { error: "Show ID is required" },
        { status: 400 }
      );
    }

    const { status, message } = await removeFromFavourites(showId, showType);
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
