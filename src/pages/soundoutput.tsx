export default function TextToSpeech() {
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <button onClick={() => speak('감사!')}>Speak</button>
    </div>
  );
}
