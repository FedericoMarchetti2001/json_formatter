import React, { useRef, useState, useEffect } from "react";
import { gothSentences } from "../sentences";
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Define TypeScript types for props
interface GothSectionProps {
  enablePlaySound: boolean;
  setEnableAIVoice: (value: boolean) => void;
  setEnablePlaySound: (value: boolean) => void;
  enableAIVoice: boolean;
  onConvert: { success: boolean } | null; // Assuming onConvert can be null initially
  gothSentence: string;
  setGothSentence: (sentence: string) => void;
}

function GothSection({ enablePlaySound, setEnablePlaySound, enableAIVoice, setEnableAIVoice, onConvert, gothSentence, setGothSentence }: GothSectionProps) {
  // GOTH THEME: Sentences, image, and music
  const gothImages: string[] = [
    "/goth-girls/goth1.jpg",
    "/goth-girls/goth2.jpeg",
    "/goth-girls/goth3.jpeg",
    "/goth-girls/goth4.jpg",
    "/goth-girls/goth5.jpg",
    "/goth-girls/goth6.jpg",
    "/goth-girls/goth7.jpg",
    "/goth-girls/goth8.jpg",
    "/goth-girls/goth10.jpg",
    "/goth-girls/goth11.jpg",
    "/goth-girls/goth12.jpg"
    // Add more as you add images to public/goth-girls/
  ];
  const successSound= "/sounds/success.mp3";
  const failSound= "/sounds/fail.mp3";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [gothGirlImg, setGothGirlImg] = useState("");
  const gothGirlTimeout = useRef<number | null>(null);

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
      voices.find(v => /female/i.test(v.name) && /en/i.test(v.lang)) ||
      voices.find(v => /en/i.test(v.lang)) ||
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
      // Set random sentence
      const sentence = gothSentences[Math.floor(Math.random() * gothSentences.length)];
      setGothSentence(sentence);
      // Set random image and trigger animation
      setGothGirlImg(gothImages[Math.floor(Math.random() * gothImages.length)]);
      setIsDrawerOpen(true); // Open the drawer
      // Play sound if enabled
      if (enablePlaySound) {
        playSound(onConvert.success ? successSound : failSound);
      }
      // Speak sentence if enabled
      if (enableAIVoice) {
        speakSentence(sentence);
      }
      // Close drawer after animation duration
      if (gothGirlTimeout.current) clearTimeout(gothGirlTimeout.current);
      gothGirlTimeout.current = setTimeout(() => setIsDrawerOpen(false), 3000); // Close after 3 seconds
    }
  }, [onConvert]); // Depend on onConvert prop

  return (
    <>
      {/* Controls for sound and AI voice */}
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

      {/* GOTH GIRL DRAWER */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)} // Allow closing by clicking outside
        className="goth-drawer" // Add class name for styling
      >
        <Box
          sx={{ width: 250 }} // Adjust width as needed
          role="presentation"
          // onClick={() => setIsDrawerOpen(false)} // Close on click inside if desired
          // onKeyDown={() => setIsDrawerOpen(false)} // Close on keydown if desired
        >
          <Typography variant="h6" sx={{ p: 2 }}>
            Goth Girl Says:
          </Typography>
          <Typography variant="body1" sx={{ px: 2, pb: 2 }}>
            {gothSentence}
          </Typography>
          {gothGirlImg && (
            <img
              src={gothGirlImg}
              alt="Goth Girl"
              style={{ width: '100%', height: 'auto', display: 'block' }} // Basic image styling
              draggable={false}
            />
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default GothSection;