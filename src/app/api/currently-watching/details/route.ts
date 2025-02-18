import { getCurrentUser } from "@/services/watchListService";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//returns user's currentlyWatching list
export async function GET() {
  try {
    const { user, status, message } = await getCurrentUser();

    // If user is null, return early with status and message
    if (user == null) {
      return NextResponse.json({ message }, { status });
    }

    const currentlyWatching = await prisma.currentlyWatching.findMany({
      where: {
        userId: user.id,
      },
    });

    // If user is found, return the user's favourites and message
    return NextResponse.json({ data: currentlyWatching, message }, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//deleting something from the user's watching list
export async function DELETE(req: NextRequest) {
  try {
    const { user, status, message } = await getCurrentUser();

    // Return proper NextResponse for unauthorized user
    if (!user) {
      return NextResponse.json({ message }, { status });
    }

    const body = await req.json();
    const { showId, showType } = body;

    if (!showId || !showType) {
      return NextResponse.json(
        { error: "Missing required params" },
        { status: 400 }
      );
    }

    const parsedShowId = parseInt(showId);

    console.log(`parsedShowId: ${parsedShowId} -> ${typeof parsedShowId}`);
    console.log(`showType: ${showType} -> ${typeof showType}`);

    // Add error handling for the delete operation
    const deleteResult = await prisma.currentlyWatching.deleteMany({
      where: {
        userId: user.id,
        showId: parsedShowId,
        showType,
      },
    });

    // Check if any records were actually deleted
    if (deleteResult.count === 0) {
      return NextResponse.json(
        { message: "No matching record found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Show successfully removed!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
