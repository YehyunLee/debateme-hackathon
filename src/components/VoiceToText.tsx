/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { LayoutRouter } from 'next/dist/server/app-render/entry-base';
import { useState } from 'react';
import { start } from 'repl';
import {motion} from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function VoiceToText() {
  //const [transcript, setTranscript] = useState('');
  const [style, setStyle] = useState("idle");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-explicit-any
  //var recognition: any = null;

  const [toggle, setToggle] = useState<boolean>(false);

  const toggleListening = () => {
    setToggle(!toggle);

    if (style !== "idle") setStyle("idle");
    else setStyle("fill-red-500");
    if (!toggle) {
      SpeechRecognition.startListening({continuous: true});
      resetTranscript;
    }
    else {
      SpeechRecognition.stopListening();
    }
  };
  
  

  return (
    <>
    <div className='w-100vw clear-both mb-[128px] pt-20 flex-col items-center justify-center text-center'>
      <button onClick={toggleListening} className="border-2 rounded-full p-[0.25rem] border-black">
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
