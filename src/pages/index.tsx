import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import Image from "next/image";

import { api } from "~/utils/api";
import DebateLeaderboard from "~/components/debateLeaderboard";





const users: [string, number][] = [
  ['user1', 10],
  ['user2', 15],
  ['user3', 20],
  ['user4', 20],
  ['user5', 20]
];


export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

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
        <div className="bg-F5FAFA snap-center">
        <DebateLeaderboard data={users}/>
        </div>
        <div className="bg-F5FAFA snap-start">
        <div className="textBlock text-1E635F bg-F5FAFA flex pt-8 pb-8 w-[60vw] flex-col mr-[auto] ml-[auto] [&>*]:mb-[0.5rem]">
          <h2 className="text-3xl font-bold"> What is Debate Me?</h2>
          <p> Join the conversation and sharpen your debate skills with Debate Me.
             Whether you're a seasoned debater or just getting started, Debate.Me 
             offers an immersive platform to engage in meaningful discussions and 
             hone your communication abilities.
             </p>
          <p> <b>Customized Topics: </b> Tailor your debates to your interests. 
            Choose between "Normal" mode to select topics generated by AI or dive into the challenge with "Crazy" 
            mode for unpredictable debates.
            </p>
            <p> <b>Leaderboard: </b> Compete with others and track your progress on the leaderboard. 
            Aim for the top spot by mastering the art of persuasive communication.</p>
            
            <p className="!mb-[1.5rem]"> <b>Debate Grade Average (DPA):  </b> Receive real-time feedback on your debate performance. 
            Our advanced analysis evaluates your content, tone, and delivery, providing insights to help you improve your skills.</p>
            
            <p > <b>How It Works: </b> </p>

            <p> <b>Sign Up: </b> Create your Debate.Me account and select your interests and preferred debate mode. </p>

            <p> <b> Choose Your Mode: </b> Opt for "Normal" to explore a range of topics or embrace the challenge of "Crazy"
             mode for unexpected debates. </p>

            <p> <b> Record Your Stance:</b> Record your arguments and viewpoints on the given topic. Let your voice be heard 
            as you articulate your perspective. </p>

            <p> <b> Receive Feedback: </b> Get instant feedback on your debate performance, including your DPA score and areas 
            for improvement. </p>

            <p> <b> Compete and Improve: </b>Climb the leaderboard and strive for excellence as you refine your debate skills 
            and engage in compelling discussions. </p>
        </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-black">
          <p className="text-2xl">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          
          </p>
          <AuthShowcase />
        </div>

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

  {/* <p>
  {sessionData?.name}
  </p> */}
</div>

  );
}