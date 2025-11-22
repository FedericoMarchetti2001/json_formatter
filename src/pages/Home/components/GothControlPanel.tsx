// GothControlPanel.tsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gothSuccessSentences, gothFailureSentences } from "../sentences";
import Box from "@mui/material/Box";
import ReactFlagsSelect from "react-flags-select";
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify components
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import SoundAndVoiceControls from "./SoundAndVoiceControls"; // Import SoundAndVoiceControls
import AchievementImportExport from "./AchievementImportExport"; // Import AchievementImportExport

// Define TypeScript types for props
interface GothControlPanelProps {
  enablePlaySound: boolean;
  setEnableAIVoice: (value: boolean) => void;
  setEnablePlaySound: (value: boolean) => void;
  enableAIVoice: boolean;
  onConvert: { success: boolean } | null; // Assuming onConvert can be null initially
  gothSentence: string;
  setGothSentence: (sentence: string) => void;
  onExportAchievements: () => void; // Add export prop
  onImportAchievements: (data: string) => void; // Add import prop
}

function GothControlPanel({
  enablePlaySound,
  setEnablePlaySound,
  enableAIVoice,
  setEnableAIVoice,
  onConvert,
  setGothSentence,
  onExportAchievements,
  onImportAchievements,
}: GothControlPanelProps) {
  const { t, i18n } = useTranslation();
  const successSound = "/sounds/success.mp3";
  const failSound = "/sounds/fail.mp3";

  // Play sound utility
  const playSound = (src: string) => {
    const audio = new window.Audio(src);
    audio.volume = 0.5;
    audio.play();
  };

  // AI Voice utility using Web Speech API
  const speakSentence = (sentence: string) => {
    if (!window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    // Try to pick a "goth and sweet" voice: prefer female, English, lower pitch
    const gothVoice: SpeechSynthesisVoice | undefined =
      voices.find((v) => /female/i.test(v.name) && /en/i.test(v.lang)) ||
      voices.find((v) => /en/i.test(v.lang)) ||
      voices[0];

    // If voices are not loaded yet (Chrome bug), try again after a short delay
    if (!gothVoice && typeof window !== "undefined") {
      setTimeout(() => speakSentence(sentence), 200);
      return;
    }

    // Estimate rate so the sentence is read in 3 seconds
    const avgCharsPerSecondAtRate1 = 13; // empirical value, can be tuned
    const estimatedDurationAtRate1 = sentence.length / avgCharsPerSecondAtRate1;
    let rate = estimatedDurationAtRate1 / 3;
    rate = Math.max(0.5, Math.min(3, rate)); // Clamp to Web Speech API limits
    
    const utter = new window.SpeechSynthesisUtterance(sentence);
    utter.voice = gothVoice;
    utter.pitch = 0.7; // lower pitch for goth
    utter.rate = rate;
    utter.volume = 1.0;
    utter.lang = gothVoice ? gothVoice.lang : "en-US";
    window.speechSynthesis.speak(utter);
  };

  // Handler for after conversion - This will be called from the parent
  useEffect(() => {
    if (onConvert) {
      const sentences = onConvert.success ? gothSuccessSentences : gothFailureSentences;
      // const images = onConvert.success ? gothSuccessImages : gothFailureImages; // Images handled in InputOutputSection

      // Set random sentence
      const sentence = sentences[Math.floor(Math.random() * sentences.length)];
      setGothSentence(sentence);
      // Set random image and trigger animation (handled in InputOutputSection/Home)
      // const imageUrl = images[Math.floor(Math.random() * images.length)];
      // setGothGirlImg(imageUrl);
      // setIsDrawerOpen(true); // Removed
      // setShowOpenButton(true); // Removed
      // Play sound if enabled
      if (enablePlaySound) {
        playSound(onConvert.success ? successSound : failSound);
      }
      // Speak sentence if enabled
      if (enableAIVoice) {
        speakSentence(sentence);
      }

      // Show toast notification
      if (onConvert.success) {
        toast.success(t("toast.success"));
      } else {
        toast.error(t("toast.failure"));
      }

      // Removed the timeout to close the drawer automatically
    }
  }, [onConvert, enablePlaySound, enableAIVoice, setGothSentence]); // Depend on onConvert, enablePlaySound, enableAIVoice, and setGothSentence


  return (
    <Box>
      {/* Language Switcher */}
      <Box sx={{ mt: 2 }}>
        <ReactFlagsSelect
          countries={["US", "DE"]}
          customLabels={{ US: "English", DE: "Deutsch" }}
          selected={i18n.language.toUpperCase()}
          onSelect={(code) => i18n.changeLanguage(code.toLowerCase())}
        />
      </Box>

      {/* Controls for sound and AI voice */}
      <SoundAndVoiceControls
        enablePlaySound={enablePlaySound}
        setEnablePlaySound={setEnablePlaySound}
        enableAIVoice={enableAIVoice}
        setEnableAIVoice={setEnableAIVoice}
      />

      {/* Achievement Import/Export Component */}
      <AchievementImportExport onExport={onExportAchievements} onImport={onImportAchievements} />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
}

export default GothControlPanel;