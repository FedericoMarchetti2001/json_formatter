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
import React, { useState, useEffect } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Custom components
import FormatterAction from "./components/FormatterActions";
import InputOutputSection from "./components/InputOutputSection";
import GothSection from "./components/GothSection";

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

  // GOTH THEME: State for toggling sound and AI voice
  const [gothSentence, setGothSentence] = useState("");
  const [enablePlaySound, setEnablePlaySound] = useState(true);
  const [enableAIVoice, setEnableAIVoice] = useState(true);
  const [gothConvertResult, setGothConvertResult] = useState(null); // State to trigger GothSection effects

  // Update textArray when text changes
  useEffect(() => {
    setTextArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[currentPage - 1] = text;
      return newArray;
    });
    setIsValid(undefined); // Reset validation status when text changes
  }, [text, currentPage]);

  // Update formattedTextArray when formattedText changes
  useEffect(() => {
    setFormattedTextArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[currentPage - 1] = formattedText;
      return newArray;
    });
  }, [formattedText, currentPage]);

  // Update text and formattedText when currentPage changes
  useEffect(() => {
    setText(textArray[currentPage - 1]);
    setFormattedText(formattedTextArray[currentPage - 1]);
  }, [currentPage, textArray, formattedTextArray]);

  // Handle validation and generic error toasts
  useEffect(() => {
    if (isValid === true) {
      toast.success("JSON is valid");
    } else if (isValid === false) {
      toast.error("JSON is not valid");
    }
  }, [isValid]);

  useEffect(() => {
    if (genericError !== "") {
      toast.error(genericError);
    }
  }, [genericError]);

  // Handler for after conversion to trigger GothSection effects
  const handleConvert = ({ success }) => {
    setGothConvertResult({ success });
  };

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
                text={text}
                setText={setText}
                formattedText={formattedText}
                gothSentence={gothSentence} // gothSentence is now managed within GothSection
              />
            </Grid2>
            <FormatterAction
              textToManage={text}
              setTextToManage={setText}
              isValid={isValid}
              setIsValid={setIsValid}
              setGenericError={setGenericError}
              processedText={formattedText}
              setProcessedText={setFormattedText}
              onConvert={handleConvert} // Pass the handler to FormatterAction
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
