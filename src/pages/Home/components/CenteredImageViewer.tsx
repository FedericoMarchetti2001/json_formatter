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
    <Box className="centered-image-viewer" onClick={onClose}>
      <img
        src={imageUrl}
        alt={t("CenteredImageViewer.alt", "Centered Image")}
        className="centered-image-viewer__image"
      />
    </Box>
  );
}

export default CenteredImageViewer;
