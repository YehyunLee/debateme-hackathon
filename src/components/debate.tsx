/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import Link from "next/link";
import VoiceToText from "~/components/VoiceToText";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
let userTranscript: string
export default function Debate(props: any) {
  let bubbleContainer : HTMLElement | null;
  let sessionData = props.sessionData;
  const [debatePrompt, setDebatePrompt] = useState('');
  
  console.log(props.interests);

  useEffect(() => {
    bubbleContainer = document.getElementById('bubbleContainer');

  })
  useEffect(() => {
    // Define a function to fetch user data
    const getDebatePrompt = async () => {
      try {
        if (sessionData?.user?.id) {
          // Make a POST request to the Flask backend with the user's name as input
          const response = await axios.post(
            "https://web-production-a23d.up.railway.app/generate_debate_prompts",
            {
              gamemode: props.playmode, 
              interested_subjects: props.interests
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          console.log("Fetching user data...");

          // Update the component state with the received data
          setDebatePrompt(response.data.Topic);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call the fetchUserData function when the component mounts
    getDebatePrompt();
  }, []); // Include sessionData in the dependency array



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
  <p className="pl-8 pb-8 pt-8 mr-[1rem] ml-[1rem] text-lg text-gray-700 font-semibold rounded-3xl bg-DAF2F1 shadow-2xl w-auto"> {debatePrompt} </p>
      < div id="bubbleContainer" className="w-[100vw] flex-col ">
        {/* <div className="bubble right">Ok, Thank you</div> */}
        </div>
        <VoiceToText sendTranscriptToParent={showTranscript} sessionData={sessionData} debatePrompt={debatePrompt} sendTranscriptToBot={showAnswer} />

    </>
  );
}
