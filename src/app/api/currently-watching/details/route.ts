import { getCurrentUser } from "@/services/watchListService";
import { NextRequest, NextResponse } from "next/server";

//returns user's currentlyWatching list
export async function GET(req: NextRequest, res: NextResponse) {
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
