/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { DiscordProfile } from "next-auth/providers/discord";


const Nav: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    signIn("credentials", { callbackUrl: "/play" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handlePlay = () => {
    router.push("/play");
  };

  return (
    <header className="sticky top-0 z-10 pt-6 pb-5 backdrop-filter backdrop-blur dark:bg-primary dark:text-white">
      <nav className="flex items-center justify-between h-16 font-semibold text-sm after:absolute after:inset-x-0 after:w-full after:h-12 after:shadow-hr after:z-[-1]">
        <button className="text-1E635F text-2xl font-bold ml-[1rem]"
        onClick={() => router.push("/")}>Debate Me</button>
        <div className="flex items-center">
          {session ? (
            <>
              <button
                onClick={handlePlay}
                className="mr-4 px-4 py-2 text-white bg-1E635F rounded-full hover:bg-1E635F/80"
              >
                Play
              </button>
              <button onClick={handleSignOut} className="text-black">Sign out</button>
            </>
          ) : (
            <button onClick={handleSignIn} className="text-black">Sign in</button>
          )}
          {/* use DiscordProfile */}
          <div className="ml-4 pr-4">
            {session && (
              <Image
                src={(session.user as DiscordProfile).image}
                alt="User profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
        </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
