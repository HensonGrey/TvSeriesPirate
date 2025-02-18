//checks if user is currently watching this movie
//if no, create a new record in the database
//else return

import { getCurrentUser } from "@/services/watchListService";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user, status, message } = await getCurrentUser();
    const body = await req.json();
    const { showId, showType, showTitle, imagePath } = body;

    if (!user) {
      return NextResponse.json({ message }, { status });
    }

    if (!showId || !showType || !showTitle || !imagePath) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const parsedShowId = parseInt(showId);

    const currentlyWatching = await prisma.currentlyWatching.findFirst({
      where: {
        userId: user.id,
        showId: parsedShowId,
        showType,
      },
    });

    if (!currentlyWatching) {
      await prisma.currentlyWatching.create({
        data: {
          userId: user.id,
          showId: parsedShowId,
          showTitle,
          showType,
          imagePath,
        },
      });
      return NextResponse.json({ status: 201 });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
