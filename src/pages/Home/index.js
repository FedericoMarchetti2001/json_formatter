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
import React, { useState, useEffect, useRef } from "react";
import localStorageHandler from "../../utils/localStorageHandler";
// @mui material components
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2";

// Custom components
import FormatterAction from "./components/FormatterActions/FormatterActions";
import InputOutputSection from "./components/InputOutputSection";
import GothControlPanel from "./components/GothSection"; // Renamed import
import CenteredImageViewer from "./components/CenteredImageViewer"; // Import CenteredImageViewer
import GothShortcutsOverlay from "./components/GothShortcutsOverlay";

//Other components
import FormatterPagination from "./components/Pagination";
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
  // Refs for the TextareaAutosize and JsonView components to enable scrolling
  const textareaRef = useRef(null);
  const jsonViewRef = useRef(null);

  // Pagination logic: state for managing multiple pages of text input
  const [textArray, setTextArray] = useState(() => {
    const saved = localStorageHandler.getPageContent("textArray");
    return Array.isArray(saved) ? saved : [""];
  }); // Load pages from storage or start with one page
  const [currentPage, setCurrentPage] = useState(1);
  // Formatted text: state for managing multiple pages of formatted JSON output
  const [formattedTextArray, setFormattedTextArray] = useState(() => {
    const saved = localStorageHandler.getPageContent("formattedTextArray");
    return Array.isArray(saved) ? saved : [""];
  });
  // Validation logic: state to track if the JSON input is valid
  const [validationResult, setValidationResult] = useState({ valid: true });
  const [genericError, setGenericError] = useState("");

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const prefs = localStorageHandler.getPreferences();
    return prefs.jsonTheme || "monokai";
  });

  // Save theme to preferences when changed
  useEffect(() => {
    localStorageHandler.updatePreference("jsonTheme", selectedTheme);
  }, [selectedTheme]);

  // Shortcuts overlay state: controls the visibility of the shortcuts overlay
  const [showShortcutsOverlay, setShowShortcutsOverlay] = useState(false);

  // ESC key handler for overlay: toggles the shortcuts overlay visibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowShortcutsOverlay((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Achievement State: manages unlocked achievements and their corresponding images
  const [achievements, setAchievements] = useState({
    unlocked: [], // Array of achievement IDs or names
    images: [], // Array of unlocked image paths
  });

  // State for centered image viewer: controls the visibility and content of the centered image
  const [isImageCentered, setIsImageCentered] = useState(false);
  const [centeredImageUrl, setCenteredImageUrl] = useState("");

  // Load achievements from localStorage on component mount
  useEffect(() => {
    const loaded = localStorageHandler.getAchievements();
    if (loaded && Array.isArray(loaded.unlocked) && Array.isArray(loaded.images)) {
      setAchievements(loaded);
      console.log("Achievements loaded from localStorage.");
    } else if (loaded) {
      console.error("Invalid data format in localStorage for achievements.");
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save achievements to localStorage whenever the state changes
  useEffect(() => {
    localStorageHandler.setAchievements(achievements);
    console.log("Achievements saved to localStorage.");
  }, [achievements]); // Dependency array ensures this runs when achievements state changes

  // Function to export achievements to a JSON file
  const exportAchievements = () => {
    const dataStr = JSON.stringify(achievements, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "achievements.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to import achievements from a JSON file
  const importAchievements = (data) => {
    try {
      const importedData = JSON.parse(data);
      // Basic validation (can be improved)
      if (importedData && Array.isArray(importedData.unlocked) && Array.isArray(importedData.images)) {
        setAchievements(importedData);
        console.log("Achievements imported successfully!");
      } else {
        console.error("Invalid achievement file format.");
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error parsing achievement data:", error);
      // Optionally show an error message to the user
    }
  };

  // GOTH THEME: State for toggling sound and AI voice
  const [gothSentence, setGothSentence] = useState("");
  const [enablePlaySound, setEnablePlaySound] = useState(() => {
    const prefs = localStorageHandler.getPreferences();
    return typeof prefs.enablePlaySound === "boolean" ? prefs.enablePlaySound : true;
  });
  const [enableAIVoice, setEnableAIVoice] = useState(() => {
    const prefs = localStorageHandler.getPreferences();
    return typeof prefs.enableAIVoice === "boolean" ? prefs.enableAIVoice : true;
  });
  const [gothConvertResult, setGothConvertResult] = useState(null); // State to trigger GothSection effects

  // Persist audio preferences on change
  useEffect(() => {
    localStorageHandler.updatePreference("enablePlaySound", enablePlaySound);
  }, [enablePlaySound]);

  useEffect(() => {
    localStorageHandler.updatePreference("enableAIVoice", enableAIVoice);
  }, [enableAIVoice]);

  // Persist page content arrays to localStorage
  useEffect(() => {
    localStorageHandler.setPageContent("textArray", textArray);
  }, [textArray]);

  useEffect(() => {
    localStorageHandler.setPageContent("formattedTextArray", formattedTextArray);
  }, [formattedTextArray]);

  // Update textArray when text changes
  const handleTextChange = (newText) => {
    setTextArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[currentPage - 1] = newText;
      return newArray;
    });
    setValidationResult({ valid: true }); // Reset validation status when text changes
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
    setGothConvertResult({ success });
  };

  // Handler for clicking on an achievement image to display it centered
  const handleAchievementImageClick = (imageUrl) => {
    setCenteredImageUrl(imageUrl);
    setIsImageCentered(true);
  };

  // Handler to close the centered image viewer
  const handleCenteredImageClose = () => {
    setIsImageCentered(false);
    setCenteredImageUrl("");
  };

  // Function to add a new page to the text and formatted text arrays
  const handleAddPage = () => {
    setTextArray((prevArray) => [...prevArray, ""]);
    setFormattedTextArray((prevArray) => [...prevArray, ""]);
    setCurrentPage(textArray.length + 1); // Navigate to the new page
  };

  // Function to delete a page
  const handleDeletePage = (pageToDelete) => {
    if (textArray.length <= 1) return; // Prevent deleting the last page

    const newTextArray = textArray.filter((_, index) => index + 1 !== pageToDelete);
    const newFormattedTextArray = formattedTextArray.filter(
      (_, index) => index + 1 !== pageToDelete
    );

    setTextArray(newTextArray);
    setFormattedTextArray(newFormattedTextArray);

    // Adjust currentPage if necessary
    if (currentPage === pageToDelete) {
      setCurrentPage(Math.max(1, pageToDelete - 1));
    } else if (currentPage > pageToDelete) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Effect to handle clicks on the window for scrolling to specific sections
  useEffect(() => {
    const handleWindowClick = (e) => {
      // Check if the clicked element or any of its ancestors is an interactive element
      // This prevents scrolling when the user is interacting with inputs, buttons, etc.
      const isInteractiveElement = (element) => {
        if (!element || element === document.body) return false;
        const tagName = element.tagName;
        return (
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "BUTTON" ||
          tagName === "A" ||
          element.hasAttribute("role") || // Covers elements with ARIA roles like 'button'
          element.hasAttribute("tabindex") || // Covers elements that can be focused
          element.onclick !== null // Checks if an onclick handler is present
        );
      };

      // Traverse up the DOM tree from the clicked element
      let currentElement = e.target;
      while (currentElement && currentElement !== document.body) {
        if (isInteractiveElement(currentElement)) {
          return; // An interactive element was clicked, do not scroll
        }
        currentElement = currentElement.parentElement;
      }

      // If no interactive element was clicked and no element is currently focused
      if (!document.activeElement || document.activeElement === document.body) {
        const viewportHeight = window.innerHeight;
        const clickY = e.clientY;

        if (clickY < viewportHeight / 2) {
          // Click in the top half of the viewport, scroll to TextareaAutosize
          textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Click in the bottom half of the viewport, scroll to JsonView
          jsonViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    // Attach the event listener to the window
    window.addEventListener("click", handleWindowClick);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [textareaRef, jsonViewRef]); // Re-run effect if refs change (though they typically won't)

  return (
    <div className="home-container">
      <GothShortcutsOverlay
        visible={showShortcutsOverlay}
        onClose={() => setShowShortcutsOverlay(false)}
      />
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
              <GothControlPanel // Use the renamed component
                enablePlaySound={enablePlaySound}
                setEnablePlaySound={setEnablePlaySound}
                enableAIVoice={enableAIVoice}
                setEnableAIVoice={setEnableAIVoice}
                onConvert={gothConvertResult} // Pass the state to trigger effect
                setGothSentence={setGothSentence}
                gothSentence={gothSentence} // Pass the goth sentence to display
                unlockedImages={achievements.images} // Keep unlockedImages prop for now, will move later
                onExportAchievements={exportAchievements} // Pass export handler
                onImportAchievements={importAchievements} // Pass import handler
                achievements={achievements}
                setAchievements={setAchievements}
              />
              <FormatterPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPageCount={textArray.length} // Pass total page count
                onAddPage={handleAddPage} // Pass the new page handler
                onDeletePage={handleDeletePage} // Pass the delete page handler
                achievements={achievements}
                setAchievements={setAchievements}
              />
              <InputOutputSection
                text={textArray[currentPage - 1]} // Pass current page's text
                handleTextChange={handleTextChange} // Pass handler to update textArray
                formattedText={formattedTextArray[currentPage - 1]} // Pass current page's formatted text
                gothSentence={gothSentence} // gothSentence is now managed within GothSection
                unlockedImages={achievements.images} // Pass unlocked images to InputOutputSection
                onImageClick={handleAchievementImageClick} // Pass image click handler
                textareaRef={textareaRef} // Pass ref to TextareaAutosize
                jsonViewRef={jsonViewRef} // Pass ref to JsonView
                onDeletePage={() => handleDeletePage(currentPage)}
                validationError={validationResult.error?.message}
                selectedTheme={selectedTheme}
              />
            </Grid2>
            <Grid2
              xs={2}
              container
              direction="column"
              alignItems="stretch"
            >
              <FormatterAction
                textToManage={textArray[currentPage - 1]} // Pass current page's text
                setTextToManage={handleTextChange} // Pass handler to update textArray
                setValidationResult={setValidationResult}
                setGenericError={setGenericError}
                processedText={formattedTextArray[currentPage - 1]} // Pass current page's formatted text
                setProcessedText={handleFormattedTextChange} // Pass handler to update formattedTextArray
                onConvert={handleConvert} // Pass the handler to FormatterAction
                achievements={achievements} // Pass achievements to FormatterAction (for unlocking logic later)
                setAchievements={setAchievements} // Pass setter for achievements
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            </Grid2>
          </Grid2>
        </Container>
      </Box>
      {/* Centered Image Viewer Component */}
      <CenteredImageViewer
        imageUrl={centeredImageUrl}
        isOpen={isImageCentered}
        onClose={handleCenteredImageClose}
      />
    </div>
  );
}

export default Presentation;
