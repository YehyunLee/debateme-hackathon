import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Debateme</title>
        <meta name="description" content="Debateme website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-F5FAFA">
        <div className="flex flex-col items-center gap-2 pb-4">
          <p className="text-1E635F mt-20 text-2xl">Welcome to Debate Me!</p>
          <p className="text-507371 text-2xl">
            Refine Your Debating Prowess And Communication Skills with AI
            Feedback
          </p>
        </div>

        <div className="bg-DAF2F1 h-381 flex w-full flex-col items-center gap-2">
          <div style = {{transform: 'scale(1)'}}>
          <Image
            src="/landingpage.png"
            alt="Landing Page"
            width={780}
            height={742}
          />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-black">
          <p className="text-2xl">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          
          </p>
          <AuthShowcase />
        </div>
      </div>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const callbackUrl = '/' // The URL you want to redirect to

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
<div className="flex flex-col items-center justify-center gap-4">
  <p className="text-center text-2xl text-black">
    {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
    {secretMessage && <span> - {secretMessage}</span>}
  </p>
  <button
    className="rounded-full bg-1E635F text-white px-10 py-3 font-semibold no-underline transition hover:bg-white hover:text-1E635F hover:bg-opacity-20"
    // I want redirect to home page after sign in
    // onClick={sessionData ? () => void signOut() : () => void signIn()}
    onClick={sessionData ? () => signOut() : () => signIn('credentials', { callbackUrl })}

  >
    {sessionData ? "Sign out" : "Sign in"}
  </button>

  <p>
  {sessionData?.name}
  </p>
</div>

  );
}
