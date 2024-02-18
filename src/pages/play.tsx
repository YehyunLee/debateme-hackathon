/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react"; // Import useState hook
import Debate from "~/components/debate";
import axios from "axios";

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
  const [userData, setUserData] = useState({
    dpa: null,
    interests: null,
    isLoading: true,
  });

  const [playMode, setPlayMode] = useState<"normal" | "crazy" | "init">("init"); // Initialize state for play mode

  const handlePlayMode = (mode: "normal" | "crazy" | "init") => {
    setPlayMode(mode);
    setDebateChatEnabled(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (sessionData?.user?.name) {
          const response = await axios.post(
            "https://web-production-a23d.up.railway.app/get_user",
            {
              user_id: sessionData.user.id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          setUserData({
            dpa: response.data.dpa,
            interests: response.data.interests,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [sessionData]);

  const [interests, setInterests] = useState(""); // Initialize state for interests

  const createUser = async () => {
    try {
      if (sessionData?.user?.name) {
        // Split interests by comma and trim each value
        const interestsArray = interests
          .split(",")
          .map((interest) => interest.trim());

        console.log(interestsArray, sessionData.user.id, sessionData.user.name);

        // Make a POST request to the Flask route
        const response = await axios.post(
          "https://web-production-a23d.up.railway.app/create_user",
          {
            user_id: sessionData.user.id,
            username: sessionData.user.name,
            interests: interestsArray,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        // Handle the response as needed
        console.log(response.data); // Should log "user created" if successful
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
    // refresh
    router.reload();
  };

  useEffect(() => {
    if (status === "loading") return; // Still loading, don't do anything yet

    if (!sessionData?.user) {
      router.push("/api/auth/signin?callbackUrl=%2Fplay");
    } else {
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
            {!userData.isLoading && (
              <div className="mb-4 rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
                <h2 className="mb-4 text-2xl font-bold">Profile</h2>
                {userData.isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="mb-4 rounded-lg bg-white p-4">
                    <p className="mb-2 text-black">
                      <span className="font-bold">Current DPA:</span>{" "}
                      {userData.dpa}
                    </p>
                    <p className="mb-2 text-black">
                      <span className="font-bold">Interested Topics:</span>{" "}
                      {userData.interests}
                    </p>
                  </div>
                )}
              </div>
            )}

        {userData.isLoading && (
            <div className="rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
              <h2 className="mb-4 text-2xl font-bold">Create Account</h2>
              <div className="mb-4 rounded-lg bg-white p-4">
                <label htmlFor="interests" className="block text-gray-700">
                  Type interests (e.g., &quot;AI, Politics, Sports&quot;):
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={interests} // Bind the input value to the state
                  onChange={(e) => setInterests(e.target.value)} // Update the state when the input changes
                  className="mt-1 block w-full rounded-lg border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button
                onClick={createUser} // Call createUser when the button is clicked
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Create Account
              </button>
            </div>)}
            {!userData.isLoading && (
            <div className="rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
              <h2 className="mb-4 text-2xl font-bold">Reset Account</h2>
              <div className="mb-4 rounded-lg bg-white p-4">
                <label htmlFor="interests" className="block text-gray-700">
                  Type interests (e.g., &quot;AI, Politics, Sports&quot;):
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={interests} // Bind the input value to the state
                  onChange={(e) => setInterests(e.target.value)} // Update the state when the input changes
                  className="mt-1 block w-full rounded-lg border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button
                onClick={createUser} // Call createUser when the button is clicked
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Reset Account
              </button>
            </div>)}

            {!userData.isLoading && (
              <div className="mt-4 rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
                <h2 className="mb-4 text-2xl font-bold">Play</h2>
                <div className="mb-4 rounded-lg bg-white p-4">
                  <p className="mb-2 text-1E635F">
                    Normal - debate based on topics of your interests
                  </p>
                  <p className="text-red-600">
                    Crazy - debate random topics and assigned arguments.
                    Increased bonus and penalties.
                  </p>
                </div>
                <button
                  className={`mr-2 rounded-lg bg-1E635F px-4 py-2 text-white ${playMode === "normal" ? "opacity-100" : "opacity-50"} hover:opacity-100`}
                  onClick={() => handlePlayMode("normal")}
                >
                  NORMAL
                </button>
                <button
                  className={`rounded-lg bg-red-600 px-4 py-2 text-white ${playMode === "crazy" ? "opacity-100" : "opacity-50"} hover:opacity-100`}
                  onClick={() => handlePlayMode("crazy")}
                >
                  CRAZY
                </button>
              </div>
            )}
          </div>
          <div className="w-full p-4 md:w-1/2">
            <div className="rounded-3xl bg-DAF2F1 p-4 shadow-2xl">
              <h2 className="mb-4 text-2xl font-bold">Leaderboard</h2>
              <DebateLeaderboard data={users} />
            </div>
          </div>
        </div>
      )}

      {debateChatEnabled && <Debate sessionData={sessionData}/>}
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
