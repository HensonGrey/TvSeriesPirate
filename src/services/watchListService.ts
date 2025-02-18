import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    const session = await auth();
    const user_id = session?.user?.id;

    if (!user_id) {
      return { user: null, status: 401, message: "User is not authenticated!" };
    }

    const db_user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!db_user) {
      return {
        user: null,
        status: 404,
        message: "User not found in the database!",
      };
    }

    return { user: db_user, status: 200, message: "No problems occurred!" };
  } catch (error) {
    console.error(error);
    return { user: null, status: 500, message: "Internal server error" };
  }
}

async function updateFavourites(
  showId: number,
  showType: string,
  action: "add" | "remove",
  imagePath: string = "",
  showTitle: string = ""
) {
  try {
    const { user, status, message } = await getCurrentUser();
    if (!user) return { status, message };

    if (action === "add") {
      await prisma.favourite.create({
        data: {
          userId: user.id,
          showId,
          showType,
          imagePath,
          showTitle,
        },
      });

      return {
        status: 200,
        message: "Show successfully added!",
      };
    } else {
      await prisma.favourite.deleteMany({
        where: {
          userId: user.id,
          showId,
          showType,
        },
      });

      return {
        status: 200,
        message: "Show successfully removed!",
      };
    }
  } catch (error) {
    console.error("Error in updateFavourites:", error);
    return {
      status: 500,
      message: "Failed to update favourites",
    };
  }
}

export async function addToFavourites(
  id: number,
  showType: string,
  imagePath: string,
  showTitle: string
) {
  return updateFavourites(id, showType, "add", imagePath, showTitle);
}

export async function removeFromFavourites(id: number, showType: string) {
  return updateFavourites(id, showType, "remove");
}
