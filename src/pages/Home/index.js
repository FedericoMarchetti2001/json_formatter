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
import React from "react";

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
  const [textArray, setTextArray] = React.useState(["", "", "", "", ""]); //won't ever reset
  const [text, setText] = React.useState(textArray[0]); //this will reset when changing pages
  const [currentPage, setCurrentPage] = React.useState(1);
  //formatted text 
  const [formattedTextArray, setFormattedTextArray] = React.useState(["", "", "", "", ""]);
  const [formattedText, setFormattedText] = React.useState(formattedTextArray[0]);
  //validation logic
  const [isValid, setIsValid] = React.useState(undefined);
  const [genericError, setGenericError] = React.useState("");
  //Dark mode logic
  const [isDark, setIsDark] = React.useState(false);

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
      <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
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
            <FormatterAction
              textToManage={text}
              setTextToManage={setText}
              isValid={isValid}
              setIsValid={setIsValid}
              setGenericError={setGenericError}
              //todo: change to formattedText
              processedText={formattedText}
              setProcessedText={setFormattedText}
              isDark={isDark}
              setIsDark={setIsDark}
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
