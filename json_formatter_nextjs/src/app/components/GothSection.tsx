import React, { useState, useEffect } from "react";
import { gothSuccessSentences, gothFailureSentences } from "./sentences";
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; // Import Button
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import Image from "next/image";

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

function GothSection({ enablePlaySound, setEnablePlaySound, enableAIVoice, setEnableAIVoice, onConvert, setGothSentence }: GothSectionProps) {
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

  const successSound= "/sounds/success.mp3";
  const failSound= "/sounds/fail.mp3";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [gothGirlImg, setGothGirlImg] = useState("");
  const [showOpenButton, setShowOpenButton] = useState(false); // State for the open button visibility
  const [isImageCentered, setIsImageCentered] = useState(false); // State for centered image visibility

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
      const sentences = onConvert.success ? gothSuccessSentences : gothFailureSentences;
      const images = onConvert.success ? gothSuccessImages : gothFailureImages;

      // Set random sentence
      const sentence = sentences[Math.floor(Math.random() * sentences.length)];
      setGothSentence(sentence);
      // Set random image and trigger animation
      const imageUrl = images[Math.floor(Math.random() * images.length)];
      setGothGirlImg(imageUrl);
      setIsDrawerOpen(true); // Open the drawer
      setShowOpenButton(true); // Show the open button after conversion
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

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

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
        onClose={handleDrawerClose} // Use the close handler
        className="goth-drawer" // Add class name for styling
      >
        <Box
          sx={{ width: 400 }} // Adjust width as needed
          role="presentation"
          alignItems={"center"}
          onClick={() => { // Add onClick handler
            setIsDrawerOpen(false);
            setIsImageCentered(true);
          }}
        >
          {gothGirlImg && (
            <Image
              src={gothGirlImg}
              alt="Goth Girl"
              style={{ width: '100%', height: 'auto', display: 'block'}} // Basic image styling
              draggable={false}
            />
          )}
        </Box>
      </Drawer>

      {/* Centered Goth Girl Image */}
      {isImageCentered && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1300, // Above the drawer
            maxWidth: '90vw', // Limit size
            maxHeight: '90vh', // Limit size
            bgcolor: 'linear-gradient(135deg, #18111b 60%, #2d0036 100%)', // Background from drawer
            border: '3px solid red', // Red border as requested
            borderRadius: '16px', // Rounded corners
            boxShadow: '0 8px 32px #000c', // Shadow from drawer
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden', // Hide overflow if image is larger than container
            cursor: 'pointer', // Indicate clickable
          }}
          onClick={() => setIsImageCentered(false)} // Close on click
        >
          {gothGirlImg && (
            <Image
              src={gothGirlImg}
              alt="Goth Girl"
              style={{
                display: 'block',
                maxWidth: '100%', // Image takes max width of container
                maxHeight: '100%', // Image takes max height of container
                objectFit: 'contain', // Ensure whole image is visible
              }}
            />
          )}
        </Box>
      )}

      {/* Button to open the drawer */}
      {showOpenButton && !isDrawerOpen && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleDrawerOpen}
          sx={{
            position: 'fixed', // Position fixed to stay on the left middle
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1200, // Ensure it's above other content but below the open drawer
            writingMode: 'vertical-rl', // Rotate text vertically
            textOrientation: 'mixed',
            borderTopLeftRadius: 0, // Style to look goth/triangular
            borderBottomLeftRadius: 0,
            border: '2px solid var(--accent-color)', // Use CSS variable for border
            backgroundColor: 'var(--primary-bg-color)', // Use CSS variable for background
            color: 'var(--text-color)', // Use CSS variable for text color
            fontFamily: 'var(--gothic-heading)', // Use CSS variable for font
            '&:hover': {
              backgroundColor: 'var(--accent-color)', // Hover styles
              color: '#18141a',
            },
          }}
          className="goth-open-drawer-button" // Add class for potential further styling
        >
          Show Goth Girl
        </Button>
      )}

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
    </>
  );
}

export default GothSection;