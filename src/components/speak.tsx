/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

function TextToSpeech({ text }: { text: string }) {
  const { speak } = useSpeechSynthesis();

  const handleSpeak = () => {
    speak({ text });
  };

  return (
    <div>
      <button onClick={handleSpeak}>Speak</button>
    </div>
  );
}

export default TextToSpeech;
