import React from "react";

interface SoundAndVoiceControlsProps {
  enablePlaySound: boolean;
  setEnablePlaySound: (value: boolean) => void;
  enableAIVoice: boolean;
  setEnableAIVoice: (value: boolean) => void;
}

function SoundAndVoiceControls({
  enablePlaySound,
  setEnablePlaySound,
  enableAIVoice,
  setEnableAIVoice,
}: SoundAndVoiceControlsProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5em", marginBottom: "0.5em" }}>
      <label>
        <input
          type="checkbox"
          checked={enablePlaySound}
          onChange={(e) => setEnablePlaySound(e.target.checked)}
        />
        Play Sound
      </label>
      <label>
        <input
          type="checkbox"
          checked={enableAIVoice}
          onChange={(e) => setEnableAIVoice(e.target.checked)}
        />
        AI Voice (Goth & Sweet)
      </label>
    </div>
  );
}

export default SoundAndVoiceControls;