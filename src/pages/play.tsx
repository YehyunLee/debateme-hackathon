/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react"; // Import useState hook
import Debate from "~/components/debate";

import { api } from "~/utils/api";
import DebateLeaderboard from "~/components/debateLeaderboard";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const [debateChatEnabled, setDebateChatEnabled] = useState<boolean>(false);
  const users: [string, number][] = [
    ["user1", 10],
    ["user2", 15],
    ["user3", 20],
    ["user4", 20],
    ["user5", 20],
  ];

  const [playMode, setPlayMode] = useState<'normal' | 'crazy'>('normal'); // Initialize state for play mode

  const handlePlayMode = (mode: 'normal' | 'crazy') => {
    setPlayMode(mode);
    setDebateChatEnabled(true);
  };

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
        <title>Debate Me Play</title>
        <meta name="description" content="Debateme website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!debateChatEnabled && (
      <div className="flex flex-col md:flex-row">
        <div className="w-full p-4 md:w-1/2">
          <div className="rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold">Profile</h2>
            <div className="mb-4 rounded-lg bg-white p-4">
              <p className="mb-2 text-black">
                <span className="font-bold">Current DPA:</span> {sessionData?.user?.name}
              </p>
              <p className="mb-2 text-black">
                <span className="font-bold">Interested Topics:</span> AI,
                Politics, Sports
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold">Play</h2>
            <div className="mb-4 rounded-lg bg-white p-4">
              <p className="mb-2 text-1E635F">
                Normal - debate based on topics of your interests
              </p>
              <p className="text-red-600">
                Crazy - debate random topics and assigned arguments. Increased
                bonus and penalties.
              </p>
            </div>
            <button className={`mr-2 rounded-lg bg-1E635F px-4 py-2 text-white ${playMode === 'normal' ? 'opacity-100' : 'opacity-50'}`} onClick={() => handlePlayMode('normal')}>
              NORMAL
            </button>
            <button className={`rounded-lg bg-red-600 px-4 py-2 text-white ${playMode === 'crazy' ? 'opacity-100' : 'opacity-50'}`} onClick={() => handlePlayMode('crazy')}>
              CRAZY
            </button>
          </div>
        </div>
        <div className="w-full p-4 md:w-1/2">
          <div className="rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold">Leaderboard</h2>
            <DebateLeaderboard data={users} />
          </div>
        </div>
      </div>
      )}

      {debateChatEnabled && <Debate />}

    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const callbackUrl = "/play";

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-start justify-start gap-2 pb-4">
      <p className="mt-6 text-5xl font-extrabold text-black">
        {sessionData && <span>Welcome back {sessionData.user?.name}</span>}
      </p>
    </div>
  );
}
