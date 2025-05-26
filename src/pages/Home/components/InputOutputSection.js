import React from "react";
import { TextareaAutosize } from "@mui/material";
import MKBox from "components/MKBox";
import PropTypes from "prop-types";

const textAreaStyle = {
  width: "100%",
  height: "100%",
  overflow: "auto",
};

InputOutputSection.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  formattedText: PropTypes.string.isRequired,
  gothSentence: PropTypes.string,
};

function InputOutputSection({ text, setText, formattedText, gothSentence }) {
  const handleTextareaKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setText(text.substring(0, start) + "\t" + text.substring(end));
    }
  };

  const handleTextareaChange = (textObject) => {
    setText(textObject.target.value);
    // setIsValid(undefined); // This state update will be handled in the parent or a different component
  };

  return (
    <MKBox style={{ flex: 1 }}>
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
    </MKBox>
  );
}

export default InputOutputSection;