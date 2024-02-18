function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // Set the language to English
  window.speechSynthesis.speak(utterance);
}

export default speak;
