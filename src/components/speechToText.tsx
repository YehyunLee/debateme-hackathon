import { useState } from 'react';

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');
  let recognition: SpeechRecognition | null = null;

  const startListening = () => {
    setTranscript(''); // Reset the transcript when starting a new recording
    recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Enable continuous recognition

    recognition.onresult = (event: SpeechRecognitionEvent) => {
    // Append the new transcript to the existing one
    const newTranscript = event.results[event.results.length - 1][0].transcript;
    setTranscript((oldTranscript) => `${oldTranscript} ${newTranscript}`);
    };

    recognition.start();
  };

  const stopListening = () => {
    // set max time to 0 
    recognition.continuous = false;
    recognition.maxTime = 0;
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
