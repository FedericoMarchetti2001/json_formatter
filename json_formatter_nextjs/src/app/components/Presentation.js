"use client";

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
import React, { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2";

// Custom components
import FormatterAction from "./FormatterActions";
import InputOutputSection from "./InputOutputSection";
import GothSection from "../components/GothSection/GothSection";

//Other components
import FormatterPagination from "./Pagination";
import { Box } from "@mui/material";

const containerStyle = {
  maxHeight: "70vh",
  minHeight: "50vh",
  minWidth: "50vw",
  maxWidth: "65vw",
  display: "flex",
  flexDirection: "column",
};

function Presentation() {
  //pagination logic
  const [textArray, setTextArray] = useState(["", "", "", "", ""]); //won't ever reset
  const [currentPage, setCurrentPage] = useState(1);
  //formatted text
  const [formattedTextArray, setFormattedTextArray] = useState(["", "", "", "", ""]);
  //validation logic
  const [isValid, setIsValid] = useState(undefined);
  const [genericError, setGenericError] = useState("");

  // GOTH THEME: State for toggling sound and AI voice
  const [gothSentence, setGothSentence] = useState("");
  const [enablePlaySound, setEnablePlaySound] = useState(true);
  const [enableAIVoice, setEnableAIVoice] = useState(true);
  const [gothConvertResult, setGothConvertResult] = useState(null); // State to trigger GothSection effects

  // Update textArray when text changes
  // Update textArray when input changes
  const handleTextChange = (newText) => {
    setTextArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[currentPage - 1] = newText;
      return newArray;
    });
    setIsValid(undefined); // Reset validation status when text changes
  };

  // Update formattedTextArray when formatted text changes
  const handleFormattedTextChange = (newFormattedText) => {
    setFormattedTextArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[currentPage - 1] = newFormattedText;
      return newArray;
    });
  };

  // Handler for after conversion to trigger GothSection effects
  const handleConvert = ({ success }) => {
    console.log("genericError", genericError); //todo: remove this log
    setGothConvertResult({ success });
  };

  return (
    <div className="home-container">
      <Box
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
            <Grid2 item xs={10} style={{ flex: 1 }}>
              <GothSection
                enablePlaySound={enablePlaySound}
                setEnablePlaySound={setEnablePlaySound}
                enableAIVoice={enableAIVoice}
                setEnableAIVoice={setEnableAIVoice}
                onConvert={gothConvertResult} // Pass the state to trigger effect
                setGothSentence={setGothSentence}
                gothSentence={gothSentence} // Pass the goth sentence to display
              />
              <FormatterPagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
              <InputOutputSection
                text={textArray[currentPage - 1]} // Pass current page's text
                handleTextChange={handleTextChange} // Pass handler to update textArray
                formattedText={formattedTextArray[currentPage - 1]} // Pass current page's formatted text
                gothSentence={gothSentence} // gothSentence is now managed within GothSection
              />
            </Grid2>
            <Grid2
              xs={2}
              container
              direction="column"
              alignItems="stretch"
              style={{ padding: "10px" }}
            >
              <FormatterAction
                textToManage={textArray[currentPage - 1]} // Pass current page's text
                setTextToManage={handleTextChange} // Pass handler to update textArray
                isValid={isValid}
                setIsValid={setIsValid}
                setGenericError={setGenericError}
                processedText={formattedTextArray[currentPage - 1]} // Pass current page's formatted text
                setProcessedText={handleFormattedTextChange} // Pass handler to update formattedTextArray
                onConvert={handleConvert} // Pass the handler to FormatterAction
              />
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </div>
  );
}

export default Presentation;
