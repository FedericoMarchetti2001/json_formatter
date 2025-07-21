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

// Custom components
import FormatterAction from "./components/FormatterActions";
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
  //pagination logic
  const [textArray, setTextArray] = useState([""]); // Start with one page
  const [currentPage, setCurrentPage] = useState(1);
  //formatted text
  const [formattedTextArray, setFormattedTextArray] = useState([""]);
  //validation logic
  const [isValid, setIsValid] = useState(undefined);
  const [genericError, setGenericError] = useState("");

  // Shortcuts overlay state
  const [showShortcutsOverlay, setShowShortcutsOverlay] = useState(false);

  // ESC key handler for overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowShortcutsOverlay((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Achievement State
  const [achievements, setAchievements] = useState({
    unlocked: [], // Array of achievement IDs or names
    images: [], // Array of unlocked image paths
  });

  // State for centered image viewer
  const [isImageCentered, setIsImageCentered] = useState(false);
  const [centeredImageUrl, setCenteredImageUrl] = useState("");

  // Load achievements from localStorage on component mount
  useEffect(() => {
    const savedAchievements = localStorage.getItem('jsonFormatterAchievements');
    if (savedAchievements) {
      try {
        const parsedAchievements = JSON.parse(savedAchievements);
        // Basic validation
        if (parsedAchievements && Array.isArray(parsedAchievements.unlocked) && Array.isArray(parsedAchievements.images)) {
          setAchievements(parsedAchievements);
          console.log("Achievements loaded from localStorage.");
        } else {
          console.error("Invalid data format in localStorage for achievements.");
        }
      } catch (error) {
        console.error("Error parsing achievements from localStorage:", error);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save achievements to localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem('jsonFormatterAchievements', JSON.stringify(achievements));
      console.log("Achievements saved to localStorage.");
    } catch (error) {
      console.error("Error saving achievements to localStorage:", error);
    }
  }, [achievements]); // Dependency array ensures this runs when achievements state changes

  // Function to export achievements
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

  // Function to import achievements
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
    setGothConvertResult({ success });
  };

  // Handler for clicking on an achievement image
  const handleAchievementImageClick = (imageUrl) => {
    setCenteredImageUrl(imageUrl);
    setIsImageCentered(true);
  };

  // Handler to close the centered image viewer
  const handleCenteredImageClose = () => {
    setIsImageCentered(false);
    setCenteredImageUrl("");
  };


 // Function to add a new page
 const handleAddPage = () => {
   setTextArray((prevArray) => [...prevArray, ""]);
   setFormattedTextArray((prevArray) => [...prevArray, ""]);
   setCurrentPage(textArray.length + 1); // Navigate to the new page
 };

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
             />
             <FormatterPagination
               currentPage={currentPage}
               setCurrentPage={setCurrentPage}
               totalPageCount={textArray.length} // Pass total page count
               onAddPage={handleAddPage} // Pass the new page handler
             />
             <InputOutputSection
               text={textArray[currentPage - 1]} // Pass current page's text
               handleTextChange={handleTextChange} // Pass handler to update textArray
               formattedText={formattedTextArray[currentPage - 1]} // Pass current page's formatted text
               gothSentence={gothSentence} // gothSentence is now managed within GothSection
               unlockedImages={achievements.images} // Pass unlocked images to InputOutputSection
               onImageClick={handleAchievementImageClick} // Pass image click handler
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
               isValid={isValid}
               setIsValid={setIsValid}
               setGenericError={setGenericError}
               processedText={formattedTextArray[currentPage - 1]} // Pass current page's formatted text
               setProcessedText={handleFormattedTextChange} // Pass handler to update formattedTextArray
               onConvert={handleConvert} // Pass the handler to FormatterAction
               achievements={achievements} // Pass achievements to FormatterAction (for unlocking logic later)
               setAchievements={setAchievements} // Pass setter for achievements
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
