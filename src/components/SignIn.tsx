"use client";
import React from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

export default function SignIn() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
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
