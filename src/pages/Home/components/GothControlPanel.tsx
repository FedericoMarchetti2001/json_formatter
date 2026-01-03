// GothControlPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { gothSuccessSentences, gothFailureSentences } from "../sentences";
import Box from "@mui/material/Box";
import ReactFlagsSelect from "react-flags-select";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify components
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import {
  AchievementEvent,
  checkAchievements,
  ACHIEVEMENT_IMAGES,
} from "../../../config/achievements";
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
  achievements: { unlocked: string[]; images: string[] };
  setAchievements: React.Dispatch<React.SetStateAction<{ unlocked: string[]; images: string[] }>>;
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
  achievements,
  setAchievements,
}: GothControlPanelProps) {
  const { t, i18n } = useTranslation();
  const successSound = "/sounds/success.mp3";
  const failSound = "/sounds/fail.mp3";
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Play sound utility
  const playSound = (src: string) => {
    const audio = new window.Audio(src);
    audio.volume = 0.5;
    audio.play();
  };

  const femaleVoiceHints = useMemo(
    () => [
      "female",
      "woman",
      "girl",
      "zira",
      "samantha",
      "victoria",
      "susan",
      "karen",
      "moira",
      "tessa",
      "serena",
      "fiona",
      "joanna",
      "ivy",
      "kendra",
      "kimberly",
      "salli",
      "olivia",
      "ava",
      "emma",
      "aria",
      "jenny",
      "michelle",
      "luna",
      "lea",
      "chloe",
      "isabelle",
      "allison",
      "amanda",
      "catherine",
      "clara",
      "amy",
    ],
    []
  );

  const isEnglishVoice = (voice: SpeechSynthesisVoice) => /^en([_-]|$)/i.test(voice.lang);

  const hasFemaleHint = (voice: SpeechSynthesisVoice) => {
    const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
    return femaleVoiceHints.some((hint) => name.includes(hint));
  };

  const pickSweetFemaleVoice = (voices: SpeechSynthesisVoice[]) => {
    if (!voices.length) return null;

    const scored = voices.map((voice) => {
      let score = 0;
      if (hasFemaleHint(voice)) score += 4;
      if (isEnglishVoice(voice)) score += 3;
      if (voice.default) score += 1;
      if (voice.localService) score += 1;
      return { voice, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.voice || voices[0];
  };

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const updateVoices = () => setAvailableVoices(synth.getVoices());
    updateVoices();
    synth.onvoiceschanged = updateVoices;
    return () => {
      if (synth.onvoiceschanged === updateVoices) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  // AI Voice utility using Web Speech API
  const speakSentence = (sentence: string) => {
    if (!window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const voices = availableVoices.length ? availableVoices : synth.getVoices();

    // Prefer a recognizable female, English voice for a softer tone.
    const gothVoice = pickSweetFemaleVoice(voices);

    // If voices are not loaded yet (Chrome bug), try again after a short delay
    if (!gothVoice && typeof window !== "undefined") {
      setTimeout(() => speakSentence(sentence), 200);
      return;
    }

    // Estimate rate so the sentence is read in 3 seconds, then gently clamp.
    const avgCharsPerSecondAtRate1 = 13; // empirical value, can be tuned
    const estimatedDurationAtRate1 = sentence.length / avgCharsPerSecondAtRate1;
    let rate = estimatedDurationAtRate1 / 3;
    rate = Math.max(0.85, Math.min(1.2, rate)); // Clamp to a softer cadence
    
    const utter = new window.SpeechSynthesisUtterance(sentence);
    utter.voice = gothVoice;
    utter.pitch = 1.15; // slightly higher pitch for a sweet tone
    utter.rate = rate;
    utter.volume = 1.0;
    utter.lang = gothVoice ? gothVoice.lang : "en-US";
    if (synth.speaking) {
      synth.cancel();
    }
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
    <Box className="goth-header">
      <Box className="goth-header__inner">

        {/* Second Row: Sound Controls and Achievement Import/Export */}
        <Box className="goth-header__row goth-header__row--controls">
          {/* Controls for sound and AI voice */}
          <SoundAndVoiceControls
            enablePlaySound={enablePlaySound}
            setEnablePlaySound={setEnablePlaySound}
            enableAIVoice={enableAIVoice}
            setEnableAIVoice={setEnableAIVoice}
          />

          {/* Achievement Import/Export Component */}
          <AchievementImportExport
          onExport={() => {
            const newlyUnlocked = checkAchievements(
              AchievementEvent.EXPORT_ACHIEVEMENTS,
              achievements.unlocked,
              {}
            );
            if (newlyUnlocked.length > 0) {
              setAchievements((prev) => {
                const newAchievements = newlyUnlocked.map((a) => a.id);
                const newImages = newlyUnlocked.map((a) => ACHIEVEMENT_IMAGES[a.imageKey]);
                return {
                  ...prev,
                  unlocked: [...prev.unlocked, ...newAchievements],
                  images: [...new Set([...prev.images, ...newImages])],
                };
              });
              newlyUnlocked.forEach((a) => toast.warn(`Achievement unlocked: ${a.name}`, { icon: () =>  <EmojiEventsIcon /> }));
            }
            onExportAchievements();
          }}
          onImport={(data) => {
            const newlyUnlocked = checkAchievements(
              AchievementEvent.IMPORT_ACHIEVEMENTS,
              achievements.unlocked,
              {}
            );
            if (newlyUnlocked.length > 0) {
              setAchievements((prev) => {
                const newAchievements = newlyUnlocked.map((a) => a.id);
                const newImages = newlyUnlocked.map((a) => ACHIEVEMENT_IMAGES[a.imageKey]);
                return {
                  ...prev,
                  unlocked: [...prev.unlocked, ...newAchievements],
                  images: [...new Set([...prev.images, ...newImages])],
                };
              });
              newlyUnlocked.forEach((a) => toast.warn(`Achievement unlocked: ${a.name}`, { icon: () =>  <EmojiEventsIcon /> }));
            }
            onImportAchievements(data);
          }}
        />
        </Box>
      </Box>
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
