"use client";

import { useRecordVoice } from "./useRecordVoice";
import IconMicrophone from "../components/IconMicrophone";

const Microphone = () => {
  const { startRecording, stopRecording, text } = useRecordVoice();

  return (
    // Button for starting and stopping voice recording
    <div className="flex flex-col justify-center items-center">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        onClick={startRecording}
        className="border-none bg-transparent w-10"
      >
        <IconMicrophone />
      </button>
      <p>{text}</p>
    </div>
  );
};

export { Microphone };