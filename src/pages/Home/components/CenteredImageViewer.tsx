import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";

export interface CenteredImageViewerProps {
  imageUrl: string;
  onClose: () => void;
  isOpen: boolean;
}

function CenteredImageViewer({ imageUrl, onClose, isOpen }: CenteredImageViewerProps) {
  if (!isOpen || !imageUrl) {
    return null;
  }
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1300, // Above the drawer
        maxWidth: "90vw", // Limit size
        maxHeight: "90vh", // Limit size
        bgcolor: "linear-gradient(135deg, #18111b 60%, #2d0036 100%)", // Background from drawer
        border: "3px solid red", // Red border as requested
        borderRadius: "16px", // Rounded corners
        boxShadow: "0 8px 32px #000c", // Shadow from drawer
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // Hide overflow if image is larger than container
        cursor: "pointer", // Indicate clickable
      }}
      onClick={onClose} // Close on click
    >
      <img
        src={imageUrl}
        alt={t("CenteredImageViewer.alt", "Centered Image")}
        style={{
          display: "block",
          maxWidth: "100%", // Image takes max width of container
          maxHeight: "100%", // Image takes max height of container
          objectFit: "contain", // Ensure whole image is visible
        }}
      />
    </Box>
  );
}

export default CenteredImageViewer;
