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

    return { user: db_user, status: 200, message: "No problems occured!" };
  } catch (error) {
    console.error(error);
    return { user: null, status: 500, message: "Internal server error" };
  }
}

async function updateFavourites(id: string, action: "add" | "remove") {
  const { user, status, message } = await getCurrentUser();
  if (user == null) return { status, message };

  const updated_watch_list =
    action === "add"
      ? [...user.watch_list, parseInt(id)]
      : user.watch_list.filter((show_id: number) => show_id !== parseInt(id));

  await prisma.user.update({
    where: { id: user.id },
    data: { watch_list: updated_watch_list },
  });

  return {
    status: 200,
    message: `Show successfully ${action === "add" ? "added" : "removed"}!`,
  };
}

export async function addToFavourites(id: string) {
  return updateFavourites(id, "add");
}

export async function removeFromFavourites(id: string) {
  return updateFavourites(id, "remove");
}
