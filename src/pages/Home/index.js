/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useRef, useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2";
import { TextareaAutosize } from "@mui/material";
import { gothSentences } from "./sentences";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Custom components
import FormatterAction from "./components/FormatterActions";

//Other components
import { ToastContainer, toast } from "react-toastify";
import FormatterPagination from "./components/Pagination";
import "../../components/DarkModeToggle/index.css";
import { DarkModeToggle } from "components/DarkModeToggle";

const containerStyle = {
  maxHeight: "70vh",
  minHeight: "50vh",
  minWidth: "50vw",
  maxWidth: "65vw",
  display: "flex",
  flexDirection: "column",
};

const textAreaStyle = {
  width: "100%",
  height: "100%",
  overflow: "auto",
};

function Presentation() {

  //pagination logic
  const [textArray, setTextArray] = useState(["", "", "", "", ""]); //won't ever reset
  const [text, setText] = useState(textArray[0]); //this will reset when changing pages
  const [currentPage, setCurrentPage] = useState(1);
  //formatted text
  const [formattedTextArray, setFormattedTextArray] = useState(["", "", "", "", ""]);
  const [formattedText, setFormattedText] = useState(formattedTextArray[0]);
  //validation logic
  const [isValid, setIsValid] = useState(undefined);
  const [genericError, setGenericError] = useState("");

  // GOTH THEME: Sentences, image, and music
  const gothImages = [
    "/goth-girls/goth1.jpg",
    "/goth-girls/goth2.jpeg",
    "/goth-girls/goth3.jpeg",
    "/goth-girls/goth4.jpg"
    // Add more as you add images to public/goth-girls/
  ];
  const successSound = "/sounds/success.mp3";
  const failSound = "/sounds/fail.mp3";

  const [gothSentence, setGothSentence] = useState("");
  const [showGothGirl, setShowGothGirl] = useState(false);
  const [gothGirlImg, setGothGirlImg] = useState("");
  const gothGirlTimeout = useRef(null);

  // New: State for toggling sound and AI voice
  const [enablePlaySound, setEnablePlaySound] = useState(true);
  const [enableAIVoice, setEnableAIVoice] = useState(true);

  // Play sound utility
  const playSound = (src) => {
    const audio = new window.Audio(src);
    audio.volume = 0.5;
    audio.play();
  };

  // AI Voice utility using Web Speech API
 // ...existing code...
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
// ...existing code...

  // Handler for after conversion
  const handleConvert = ({ success }) => {
    // Set random sentence
    const sentence = gothSentences[Math.floor(Math.random() * gothSentences.length)];
    setGothSentence(sentence);
    // Set random image and trigger animation
    setGothGirlImg(gothImages[Math.floor(Math.random() * gothImages.length)]);
    setShowGothGirl(true); // trigger re-render for animation
    // Play sound if enabled
    if (enablePlaySound) {
      playSound(success ? successSound : failSound);
    }
    // Speak sentence if enabled
    if (enableAIVoice) {
      speakSentence(sentence);
    }
    // Remove image after animation
    if (gothGirlTimeout.current) clearTimeout(gothGirlTimeout.current);
    gothGirlTimeout.current = setTimeout(() => setShowGothGirl(false), 3000);
  };

  React.useEffect(() => {
    if (isValid === true) {
      toast.success("JSON is valid");
    }
    else if(isValid === false){
      toast.error("JSON is not valid");
    }
    //isValid === undefined should do nothing
  }, [isValid]);

  React.useEffect(() => {
    if (genericError !== "") {
      toast.error(genericError);
    }
  }, [genericError]);

  React.useEffect(() => {
    setText(textArray[currentPage - 1]);
    setFormattedText(formattedTextArray[currentPage - 1]);
  }, [currentPage]);

  React.useEffect(() => {
    setTextArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[currentPage - 1] = text;
      return newArray;
    });
  },[text]);

  return (
    <div className="home-container">
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container style={containerStyle}>
          <Grid2 container xs={12} lg={12} justifyContent="center" mx="auto" style={{ flex: 1 }}>
            <Grid2 item xs={12} style={{ flex: 1 }}>
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
              <FormatterPagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
              <TextareaAutosize
                placeholder="Paste your JSON here"
                // autoSave="on" //todo: to implement
                minRows={10}
                maxRows={20}
                style={textAreaStyle}
                value={text}
                //when pressing tab, it should insert a tab instead of changing focus
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    setText(text.substring(0, start) + "\t" + text.substring(end));
                  }
                }}
                onChange={(textObject) => {
                  setText(textObject.target.value);
                  setIsValid(undefined);
                }}
              ></TextareaAutosize>
              {/* GOTH SENTENCE */}
              <div className="goth-sentence" style={{ minHeight: "2.5em" }}>
                {gothSentence}
              </div>
              <TextareaAutosize
                placeholder="Formatted JSON"
                minRows={10}
                maxRows={20}
                style={textAreaStyle}
                value={formattedText}
                readOnly
              ></TextareaAutosize>
            </Grid2>
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
            <FormatterAction
              textToManage={text}
              setTextToManage={setText}
              isValid={isValid}
              setIsValid={setIsValid}
              setGenericError={setGenericError}
              //todo: change to formattedText
              processedText={formattedText}
              setProcessedText={setFormattedText}
              onConvert={handleConvert}
            />
          </Grid2>
        </Container>
      </MKBox>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Presentation;
