import React, { ChangeEvent, KeyboardEvent, useState, useEffect, JSX, RefObject } from "react";
import { Box, TextareaAutosize } from "@mui/material";
import GothAchievementsGallery from "./GothAchievementsGallery"; // Import GothAchievementsGallery
import SentenceDisplay from "./SentenceDisplay"; // Import SentenceDisplay
import JsonView from "react-json-view"; // Import JsonView for tree view

// Define the interface for the component's props
interface InputOutputSectionProps {
  text: string;
  handleTextChange: (text: string) => void;
  formattedText: string;
  gothSentence?: string; // gothSentence can be undefined
  unlockedImages: string[];
  onImageClick: (image: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>; // Add ref for TextareaAutosize
  jsonViewRef: RefObject<HTMLDivElement>; // Add ref for JsonView
  // Add a prop for validation error message
  validationError?: string;
  onDeletePage: () => void;
  selectedTheme: string;
}

// Styles for the textarea component
const textAreaStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  overflow: "auto",
  border: "1px solid transparent", // Add a transparent border
};

const errorTextAreaStyle: React.CSSProperties = {
  ...textAreaStyle,
  border: "1px solid red", // Add a red border for errors
  boxShadow: "0 0 5px red", // Add a red glow for errors
};

/**
 * InputOutputSection Component
 * @param {InputOutputSectionProps} props - Props for the component.
 * @returns {JSX.Element} The rendered InputOutputSection component.
 */
function InputOutputSection({
  text,
  handleTextChange,
  formattedText,
  gothSentence,
  unlockedImages,
  onImageClick,
  textareaRef, // Destructure the ref
  jsonViewRef, // Destructure the ref
  onDeletePage,
  validationError,
  selectedTheme,
}: InputOutputSectionProps): JSX.Element {
  // State to hold the parsed JSON object for JsonView
  const [parsedJson, setParsedJson] = useState<object | null>(null);

  // Effect to parse formattedText whenever it changes
  useEffect(() => {
    try {
      // Attempt to parse the formatted JSON string
      const json = JSON.parse(formattedText);
      setParsedJson(json);
    } catch (error) {
      // If parsing fails, set parsedJson to null
      setParsedJson(null);
    }
  }, [formattedText]);

  /**
   * Handles key down events on the textarea, specifically for Tab key to insert a tab character.
   * @param {KeyboardEvent<HTMLTextAreaElement>} e - The keyboard event.
   */
  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      handleTextChange(text.substring(0, start) + "\t" + text.substring(end));
    }
  };

  /**
   * Handles change events on the textarea, updating the input text.
   * @param {ChangeEvent<HTMLTextAreaElement>} e - The change event.
   */
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    handleTextChange(e.target.value);
  };

  return (
    <Box
      style={{ flex: 1, height: "70%" }}
      onKeyDown={(event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
          const activeElement = document.activeElement;
          if (
            activeElement &&
            activeElement.tagName !== "TEXTAREA" &&
            activeElement.tagName !== "INPUT"
          ) {
            event.preventDefault();
            onDeletePage();
          }
        }
      }}
      tabIndex={0} // Make the Box focusable
    >
      {/* Input Textarea for JSON */}
      <TextareaAutosize
        ref={textareaRef} // Attach the ref
        placeholder="Paste your JSON here"
        minRows={10}
        maxRows={20}
        style={validationError ? errorTextAreaStyle : textAreaStyle}
        value={validationError ? `Error: ${validationError}\n\n${text}` : text}
        onKeyDown={handleTextareaKeyDown}
        onChange={handleTextareaChange} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      />
      {/* Goth Achievements Gallery Component */}
      <GothAchievementsGallery unlockedImages={unlockedImages} onImageClick={onImageClick} />
      {/* Sentence Display Component */}
      {/* Ensure gothSentence is treated as string, or SentenceDisplay handles undefined */}
      <SentenceDisplay sentence={gothSentence || ""} />

      {/* Conditional rendering for JSON Tree View or Error Message */}
        <Box ref={jsonViewRef} style={{ ...textAreaStyle}}> {/* Attach the ref */}
          <JsonView
            src={parsedJson ?? {}}
            name={false} // Hide the root name
            collapsed={false} // Start with all nodes expanded
            enableClipboard={true} // Allow copying values
            displayObjectSize={false} // Hide object size
            displayDataTypes={false} // Hide data types
            style={{width: "100%", overflow: "auto"}}
           theme={selectedTheme as any} // Choose a theme that fits the goth aesthetic
          />
        </Box>
    </Box>
  );
}

export default InputOutputSection;
