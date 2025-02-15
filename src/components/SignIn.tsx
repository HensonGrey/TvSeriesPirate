"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setFavourites } from "@/store/WatchListSlice";

export default function SignIn() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const user = session?.user;

  const handleSignOut = async () => {
    dispatch(setFavourites([]));
    await signOut();
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return user ? (
    <div className="flex flex-col items-center gap-4 p-4 border border-gray-600 rounded-lg bg-gray-800/50 max-w-md w-full mx-auto shadow-xl">
      <Image
        src="https://www.google.com/favicon.ico"
        alt="google logo"
        width={25}
        height={25}
      />
      <h2 className="text-lg text-white font-semibold">{user.name}</h2>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
      >
        Sign out
      </button>
    </div>
  ) : (
    <div className="flex flex-col border border-gray-400/20 bg-gray-800/50 p-8 backdrop-blur-sm shadow-xl max-w-md w-full mx-4 gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white text-center">
          Not Authenticated
        </h1>
        <h2 className="text-lg text-slate-300 text-center">
          Sign in to continue
        </h2>
      </div>
      <button
        onClick={() => signIn("google", { redirectTo: "/home" })}
        className="w-full bg-gray-200 hover:bg-gray-400 text-gray-800 font-semibold flex items-center justify-center rounded-lg px-4 py-3 gap-3 transition-all duration-200 shadow-md hover:shadow-lg hover:text-white"
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="google logo"
          width={25}
          height={25}
        />
        <span className="w-full cursor-pointer text-center">
          Continue with Google
        </span>
      </button>
    </div>
  );
}
