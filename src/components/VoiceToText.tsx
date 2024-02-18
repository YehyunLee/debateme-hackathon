/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import speak from '~/components/speak';


var userTranscript: string[] = []
var botTranscript: string[] = []
export default function VoiceToText(props: any) {
  //const [transcript, setTranscript] = useState('');
  const [style, setStyle] = useState("idle");

  const [loading, setLoading] = useState(true);

  let button: HTMLButtonElement;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  const retrieveResponse = useCallback(async ()  => {
    try {
      if (props.sessionData?.user?.id) {
        // Make a POST request to the Flask backend with the user's name as input
        const response = await axios.post(
          "https://web-production-a23d.up.railway.app/generate_opposing_response",
          {
            user_id: props.sessionData.user.id,
            debate_topic: props.debatePrompt, 
            user_transcript: userTranscript
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        
        // Update the component state with the received data

        props.sendTranscriptToBot(response.data.opposing_response);
        botTranscript += response.data.opposing_response;
        button.disabled = false;
        resetTranscript();
        if (1 < userTranscript.length) {
          console.log({
            user_id: props.sessionData.user.id, 
            debate_topic: props.debatePrompt, 
            user_beginning_debate: userTranscript[0],
            gpt_response: botTranscript,
            users_reply: userTranscript[1],
            gamemode: props.gamemode
          });
          getDebatePrompt()
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
}, [userTranscript]);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-explicit-any
  //var recognition: any = null;
  useEffect(() => {
    button = document.getElementById('mic') as HTMLButtonElement;
  })
  const [toggle, setToggle] = useState<boolean>(true);
  const toggleListening = () => {
    if (style !== "idle") setStyle("idle");
    else setStyle("fill-red-500");
    if (toggle) {
      SpeechRecognition.startListening({continuous: true});
      
    }
    else {
      SpeechRecognition.stopListening();
      props.sendTranscriptToParent(transcript);

      userTranscript.push(transcript);
      console.log(userTranscript.length)
      retrieveResponse()
      button.disabled = true;
      
    }
    setToggle(!toggle);
  };
  
  
    const getDebatePrompt = async () => {
      
      try {
        if (props.sessionData?.user?.id) {
          // Make a POST request to the Flask backend with the user's name as input
          const response = await axios.post(
            "https://web-production-a23d.up.railway.app/judge_debate",
            {
              user_id: props.sessionData.user.id, 
              debate_topic: props.debatePrompt, 
              user_beginning_debate: userTranscript[0],
              gpt_response: botTranscript,
              users_reply: userTranscript[1],
              gamemode: props.gamemode
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
           
          response.data.score

          // Update the component state with the received data
  
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

  if (loading) {

  }

  return (
    <>
    
    <div className='w-100vw clear-both mb-0 absolute flex-col items-center justify-center text-center sticky backdrop-filter backdrop-blur'>
      <button id="mic" onClick={toggleListening} className="border-2 rounded-full p-[0.25rem] border-black">
      <svg className={style} fill="#000000" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 viewBox="0 0 470 470">
        <g>
          <path d="M235,302.296c47.177,0,85.423-38.245,85.423-85.423V85.423C320.423,38.245,282.177,0,235,0s-85.423,38.245-85.423,85.423
            v131.451C149.577,264.051,187.823,302.296,235,302.296z"/>
          <path d="M350.423,136.148v30h15v50.726c0,71.915-58.508,130.423-130.423,130.423s-130.423-58.507-130.423-130.423v-50.726h15v-30
            h-45v80.726C74.577,300.273,138.551,369,220,376.589V440h-90.444v30h210.889v-30H250v-63.411
            c81.449-7.589,145.423-76.317,145.423-159.716v-80.726H350.423z"/>
        </g>
        </svg>
      </button>
      <p>{transcript}</p>
    </div>
    </>
  );
}