import React from "react";
import { Box, TextareaAutosize } from "@mui/material";
import PropTypes from "prop-types";

const textAreaStyle = {
  width: "100%",
  height: "100%",
  overflow: "auto",
};

InputOutputSection.propTypes = {
  text: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  formattedText: PropTypes.string.isRequired,
  gothSentence: PropTypes.string,
};

function InputOutputSection({ text, handleTextChange, formattedText, gothSentence }) {
  const handleTextareaKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      handleTextChange(text.substring(0, start) + "\t" + text.substring(end));
    }
  };

  const handleTextareaChange = (textObject) => {
    handleTextChange(textObject.target.value);
    // setIsValid(undefined); // This state update will be handled in the parent or a different component
  };

  return (
    <Box style={{ flex: 1, height: "70%" }}>
      <TextareaAutosize
        placeholder="Paste your JSON here"
        minRows={10}
        maxRows={20}
        style={textAreaStyle}
        value={text}
        onKeyDown={handleTextareaKeyDown}
        onChange={handleTextareaChange}
      />
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
      />
    </Box>
  );
}

export default InputOutputSection;