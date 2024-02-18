/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import Link from "next/link";
import VoiceToText from "~/components/VoiceToText";
import { useEffect, useState } from "react";
import axios from "axios";
var userTranscript: string
export default function Debate(props: any) {
  let bubbleContainer : HTMLElement | null;
  let sessionData = props.sessionData;
  const [debatePrompt, setDebatePrompt] = useState('');

  useEffect(() => {
    bubbleContainer = document.getElementById('bubbleContainer');

  })
  useEffect(() => {
    // Define a function to fetch user data
    const getDebatePrompt = async () => {
      try {
        if (sessionData?.user?.id) {
          // Make a POST request to the Flask backend with the user's name as input
          console.log("Hello World");
          const response = await axios.post(
            "https://web-production-a23d.up.railway.app/generate_debate_prompts",
            {
              gamemode: "normal", 
              interested_subjects: ["Artificial Intelligence", "Machine Learning", "Biden"]
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
  }, [sessionData]); // Include sessionData in the dependency array


  const showTranscript = (dataFromChild: string) => {
    userTranscript += dataFromChild;
    console.log(userTranscript);
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
    <p> {debatePrompt} </p>
      < div id="bubbleContainer" className="w-[100vw] flex-col ">
        {/* <div className="bubble right">Ok, Thank you</div> */}
        </div>
        <VoiceToText sendTranscriptToParent={showTranscript} />

    </>
  );
}
