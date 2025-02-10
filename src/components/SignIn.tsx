import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";

export default async function SignIn() {
  const session = await auth();
  console.log(session);

  const user = session?.user;
  return user ? (
    <>
      <h1 className="text-2xl">Welcome {user.name}</h1>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="p-2 border-2 bg-blue-400">Sign out</button>
      </form>
    </>
  ) : (
    <div className="flex flex-col border-2 border-gray-400/20 bg-gray-800/50 p-8 backdrop-blur-sm shadow-xl max-w-md w-full mx-4 gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white text-center">
          Not Authenticated
        </h1>
        <h2 className="text-lg text-slate-300 text-center">
          Sign in to continue
        </h2>
      </div>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/home" });
        }}
      >
        <button className="w-full bg-gray-200 hover:bg-gray-400 text-gray-800 font-semibold flex items-center justify-center rounded-lg px-4 py-3 gap-3 transition-all duration-200 shadow-md hover:shadow-lg hover:text-white">
          <Image
            src="https://www.google.com/favicon.ico"
            alt="google logo"
            width="25"
            height="25"
          />
          <span className="w-full cursor-pointer text-center">
            Continue with Google
          </span>
        </button>
      </form>
    </div>
  );
}
