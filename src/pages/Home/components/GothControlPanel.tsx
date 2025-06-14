// GothControlPanel.tsx
import React, { useState, useEffect } from "react";
import { gothSuccessSentences, gothFailureSentences } from "../sentences";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify components
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import SentenceDisplay from "./SentenceDisplay"; // Import SentenceDisplay
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
  gothSentence, // Keep gothSentence prop to pass to SentenceDisplay
  setGothSentence,
  onExportAchievements,
  onImportAchievements,
}: GothControlPanelProps) {
  // GOTH THEME: Sentences, image, and music
  const gothSuccessImages: string[] = [
    "/goth-girls/goth1.jpg",
    "/goth-girls/goth2.jpeg",
    "/goth-girls/goth3.jpeg",
    "/goth-girls/goth4.jpg",
    "/goth-girls/goth6.jpg",
    "/goth-girls/goth8.jpg",
    // Add more success images
  ];

  const gothFailureImages: string[] = [
    "/goth-girls/goth7.jpg",
    "/goth-girls/goth10.jpg",
    "/goth-girls/goth11.jpg",
    "/goth-girls/goth12.jpg",
    // Add more failure images
  ];

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
        toast.success("Conversion successful!");
      } else {
        toast.error("Conversion failed.");
      }

      // Removed the timeout to close the drawer automatically
    }
  }, [onConvert, enablePlaySound, enableAIVoice, setGothSentence]); // Depend on onConvert, enablePlaySound, enableAIVoice, and setGothSentence


  return (
    <Box>
      {/* Controls for sound and AI voice */}
      <SoundAndVoiceControls
        enablePlaySound={enablePlaySound}
        setEnablePlaySound={setEnablePlaySound}
        enableAIVoice={enableAIVoice}
        setEnableAIVoice={setEnableAIVoice}
      />

      {/* Sentence Display Component */}
      <SentenceDisplay sentence={gothSentence} />

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