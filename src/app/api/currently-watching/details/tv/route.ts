import { getCurrentUser } from "@/services/watchListService";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//checks if user is currently watching this tv show
//if no, create a new record in the database
//and return season -> 1, episode -> 1
//if user is watching
//return season and episode data from the database
export async function GET(req: NextRequest) {
  try {
    const { user, status, message } = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const showId = searchParams.get("showId");
    const showType = searchParams.get("showType");
    const showTitle = searchParams.get("showTitle");
    const imagePath = searchParams.get("imagePath");

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

    let response;

    if (!currentlyWatching) {
      const newWatch = await prisma.currentlyWatching.create({
        data: {
          userId: user.id,
          showId: parsedShowId,
          showTitle,
          showType,
          imagePath,
          seasonNum: 1,
          episodeNum: 1,
        },
      });

      response = {
        seasonNum: newWatch.seasonNum,
        episodeNum: newWatch.episodeNum,
      };
    } else {
      response = {
        seasonNum: currentlyWatching.seasonNum,
        episodeNum: currentlyWatching.episodeNum,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//updating currently watched show's season and episode numbers
export async function PUT(req: NextRequest) {
  try {
    const { user, status, message } = await getCurrentUser();
    const body = await req.json();
    const { showId, showType, seasonNum, episodeNum } = body;

    if (!user) {
      return NextResponse.json({ message }, { status });
    }

    if (!showId || !showType || !seasonNum || !episodeNum) {
      return NextResponse.json(
        { error: "Missing required params" },
        { status: 400 }
      );
    }

    const existingEntry = await prisma.currentlyWatching.findFirst({
      where: {
        userId: user.id,
        showId: parseInt(showId),
        showType: showType,
      },
    });

    if (existingEntry) {
      await prisma.currentlyWatching.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          seasonNum,
          episodeNum,
        },
      });
    } else {
      console.log("No entry found");
    }

    return NextResponse.json({ message }, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
