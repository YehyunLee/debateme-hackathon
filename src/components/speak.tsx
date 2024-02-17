
export default function TextToSpeech() {
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set the language to English
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <button onClick={() => speak('HI!')}>Speak</button>
    </div>
  );
}
