import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import DebateLeaderboard from "~/components/debateLeaderboard";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();


  const users: [string, number][] = [
    ['user1', 10],
    ['user2', 15],
    ['user3', 20],
    ['user4', 20],
    ['user5', 20]
  ];

  useEffect(() => {
    if (status === "loading") return; // Still loading, don't do anything yet

    if (!sessionData?.user) {
      console.log("No user");
      router.push("/api/auth/signin?callbackUrl=%2Fplay");
    } else {
      console.log("User found");
    }
  }, [sessionData, status, router]);

  return (
    <>
      <Head>
        <title>Debate Me</title>
        <meta name="description" content="Debateme website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-y-scroll">
      <div className="snap-y snap-mandatory">
      <div className="bg-F5FAFA snap-start">
        <div className="flex flex-col items-center gap-2 pb-4">
          <p className="text-1E635F mt-6 text-5xl font-extrabold">Welcome to Debate Me!</p>
          <p className="text-507371 text-2xl mb-4">
            Refine Your Debating Prowess And Communication Skills with AI
            Feedback
          </p>
        </div>


        <div className="flex flex-col items-center gap-2 text-black">
          <AuthShowcase />
        </div>

        </div>

        <div className="bg-F5FAFA snap-center">
        </div>
        <div className="bg-F5FAFA snap-start">
        </div>

        </div>
        </div>

        <div className="bg-F5FAFA snap-center">
        <DebateLeaderboard data={users}/>
        </div>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const callbackUrl = '/play';

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
<div className="flex flex-col items-center justify-center gap-2 pb-4">
  <p className="text-center text-2xl text-black">
    {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
  </p>
  <button
    className="rounded-full bg-1E635F text-white px-10 py-3 font-semibold no-underline transition hover:bg-white hover:text-1E635F hover:bg-opacity-20"
    onClick={sessionData ? () => signOut() : () => signIn('credentials', { callbackUrl })}

  >
    {sessionData ? "Sign out" : "Sign in"}
  </button>

</div>

  );
}
