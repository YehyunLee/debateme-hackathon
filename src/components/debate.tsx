/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import Image from "next/image";
import VoiceToText from "~/components/VoiceToText";
import { useEffect } from "react";

export default function Debate() {
  
  let bubbleContainer : HTMLElement | null;
  useEffect(() => {
    bubbleContainer = document.getElementById('bubbleContainer');
  })


  const showTranscript = (dataFromChild: string) => {
    const newHtml = `<p class="bubble right"> ${dataFromChild} </p>`
  
    if (bubbleContainer) {
      bubbleContainer.insertAdjacentHTML("beforeend", newHtml);
    }
  };

  const showAnswer = (dataFromChild: string) => {
    const newHtml = `<p class="bubble left"> ${dataFromChild} </p>`
  
    if (bubbleContainer) {
      bubbleContainer.insertAdjacentHTML("beforeend", newHtml);
    }
  };


  
  return (
    <>
      < div id="bubbleContainer" className="w-[100vw] flex-col ">
        {/* <div className="bubble right">Ok, Thank you</div> */}
        </div>
        <VoiceToText sendTranscriptToParent={showTranscript} />

    </>
  );
}
