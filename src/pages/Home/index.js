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

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Custom components
import FormatterAction from "./components/FormatterActions";

//Other components
import { ToastContainer, toast } from "react-toastify";
import FormatterPagination from "./components/Pagination";

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
  const gothSentences = [
    "We are all broken, that's how the light gets in.",
    "In the darkness, I find my true self.",
    "JSON, like my soul, is best formatted in black.",
    "Embrace the error, for it is part of the void.",
    "Even the prettiest code has a shadow.",
    "Let the night guide your indentation.",
    "Goth girls do it with style... and valid JSON.",
    "Every bracket closed is a secret kept.",
    "Beauty in the dark, order in the chaos.",
    "My heart beats in hexadecimal."
  ];
  const gothImages = [
    "/goth-girls/goth1.jpg",
    "/goth-girls/goth2.jpg",
    "/goth-girls/goth3.jpg",
    "/goth-girls/goth4.jpg"
    // Add more as you add images to public/goth-girls/
  ];
  const successSound = "/sounds/success.mp3";
  const failSound = "/sounds/fail.mp3";

  const [gothSentence, setGothSentence] = useState("");
  const [showGothGirl, setShowGothGirl] = useState(false);
  const [gothGirlImg, setGothGirlImg] = useState("");
  const gothGirlTimeout = useRef(null);

  // Play sound utility
  const playSound = (src) => {
    const audio = new window.Audio(src);
    audio.volume = 0.5;
    audio.play();
  };

  // Handler for after conversion
  const handleConvert = ({ success }) => {
    // Set random sentence
    setGothSentence(gothSentences[Math.floor(Math.random() * gothSentences.length)]);
    // Set random image and trigger animation
    setGothGirlImg(gothImages[Math.floor(Math.random() * gothImages.length)]);
    setShowGothGirl(false); // reset
    setTimeout(() => setShowGothGirl(true), 50); // trigger re-render for animation
    // Play sound
    playSound(success ? successSound : failSound);
    // Remove image after animation
    if (gothGirlTimeout.current) clearTimeout(gothGirlTimeout.current);
    gothGirlTimeout.current = setTimeout(() => setShowGothGirl(false), 1300);
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
    <>
      {/* <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
          label: "free download",
          color: "info",
        }}
        sticky
      /> */}
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
              <TextareaAutosize
                placeholder="Formatted JSON"
                minRows={10}
                maxRows={20}
                style={textAreaStyle}
                value={formattedText}
                readOnly
              ></TextareaAutosize>
            </Grid2>
            {/* GOTH SENTENCE */}
            <div className="goth-sentence" style={{ minHeight: "2.5em" }}>
              {gothSentence}
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
            <FormatterAction
              textToManage={text}
              setTextToManage={setText}
              isValid={isValid}
              setIsValid={setIsValid}
              setGenericError={setGenericError}
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
    </>
  );
}

export default Presentation;
