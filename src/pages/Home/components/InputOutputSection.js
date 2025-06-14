import React from "react";
import { Box, TextareaAutosize } from "@mui/material";
import PropTypes from "prop-types";
import GothAchievementsGallery from "./GothAchievementsGallery"; // Import GothAchievementsGallery

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
  unlockedImages: PropTypes.arrayOf(PropTypes.string).isRequired, // Add prop type for unlockedImages
  onImageClick: PropTypes.func.isRequired, // Add prop type for onImageClick
};

function InputOutputSection({ text, handleTextChange, formattedText, gothSentence, unlockedImages, onImageClick }) {
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
      {/* Insert GothAchievementsGallery here */}
      <GothAchievementsGallery unlockedImages={unlockedImages} onImageClick={onImageClick} />
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
