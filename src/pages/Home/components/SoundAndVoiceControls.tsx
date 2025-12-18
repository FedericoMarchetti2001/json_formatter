import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <div className="sound-voice-controls">
      <label>
        <input
          type="checkbox"
          checked={enablePlaySound}
          onChange={(e) => setEnablePlaySound(e.target.checked)}
        />
        {t("SoundAndVoiceControls.playSound", "Play Sound")}
      </label>
      <label>
        <input
          type="checkbox"
          checked={enableAIVoice}
          onChange={(e) => setEnableAIVoice(e.target.checked)}
        />
        {t("SoundAndVoiceControls.aiVoice", "AI Voice (Goth & Sweet)")}
      </label>
    </div>
  );
}

export default SoundAndVoiceControls;
