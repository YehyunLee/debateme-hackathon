/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from 'react';

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-explicit-any
  let recognition: any = null;

  const startListening = () => {

    setTranscript(''); // Reset the transcript when starting a new recording
    recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Enable continuous recognition

    recognition.onresult = (event: any) => {
      // Append the new transcript to the existing one
      const newTranscript = event.results[event.results.length - 1][0].transcript;
      setTranscript((oldTranscript) => `${oldTranscript} ${newTranscript}`);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognition?.stop();
  };

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <br />
      <button onClick={stopListening}>Stop Listening</button>
      <p>{transcript}</p>
    </div>
  );
}
