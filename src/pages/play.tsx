import { useState } from 'react';

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        setTranscript(event.results[0][0].transcript);
      };
      recognition.start();
    } else {
      alert('Speech Recognition is not supported in this browser. Try Google Chrome.');
    }
  };

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <p>{transcript}</p>
    </div>
  );
}
