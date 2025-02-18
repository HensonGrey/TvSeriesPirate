"use client";
import SignIn from "@/components/SignIn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") router.replace("/home");
  }, [router, session.status]);
  return (
    <div className="min-h-screen bg-slate-700 flex flex-col justify-center items-center">
      <SignIn />
    </div>
  );
}
