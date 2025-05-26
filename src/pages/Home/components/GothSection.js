import React, { useRef, useState, useEffect } from "react";
import { gothSentences } from "../sentences";

import PropTypes from "prop-types";

GothSection.propTypes = {
  enablePlaySound: PropTypes.bool.isRequired,
  setEnableAIVoice: PropTypes.func.isRequired,
  setEnablePlaySound: PropTypes.func.isRequired,
  enableAIVoice: PropTypes.bool.isRequired,
 onConvert: PropTypes.func.isRequired,
    gothSentence: PropTypes.string,
    setGothSentence: PropTypes.func.isRequired
};

function GothSection({ enablePlaySound, setEnablePlaySound, enableAIVoice, setEnableAIVoice, onConvert, gothSentence, setGothSentence }) {
  // GOTH THEME: Sentences, image, and music
  const gothImages = [
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
  const successSound = "/sounds/success.mp3";
  const failSound = "/sounds/fail.mp3";

  const [showGothGirl, setShowGothGirl] = useState(false);
  const [gothGirlImg, setGothGirlImg] = useState("");
  const gothGirlTimeout = useRef(null);

  // Play sound utility
  const playSound = (src) => {
    const audio = new window.Audio(src);
    audio.volume = 0.5;
    audio.play();
  };

  // AI Voice utility using Web Speech API
  const speakSentence = (sentence) => {
    if (!window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();

    // Try to pick a "goth and sweet" voice: prefer female, English, lower pitch
    let gothVoice =
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
      setShowGothGirl(true); // trigger re-render for animation
      // Play sound if enabled
      if (enablePlaySound) {
        playSound(onConvert.success ? successSound : failSound);
      }
      // Speak sentence if enabled
      if (enableAIVoice) {
        speakSentence(sentence);
      }
      // Remove image after animation
      if (gothGirlTimeout.current) clearTimeout(gothGirlTimeout.current);
      gothGirlTimeout.current = setTimeout(() => setShowGothGirl(false), 3000);
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
            onChange={() => setEnablePlaySound((v) => !v)}
          />
          Play Sound
        </label>
        <label>
          <input
            type="checkbox"
            checked={enableAIVoice}
            onChange={() => setEnableAIVoice((v) => !v)}
          />
          AI Voice (Goth & Sweet)
        </label>
      </div>

      {/* GOTH GIRL IMAGE ANIMATION */}
      {showGothGirl && gothGirlImg && (
        <img
          src={gothGirlImg}
          alt="Goth Girl"
          className="goth-girl-slide"
          style={{ zIndex: 1000, position: "fixed" }}
          draggable={false}
        />
      )}
    </>
  );
}

export default GothSection;