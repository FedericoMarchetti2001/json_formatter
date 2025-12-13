import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface GothAchievementsGalleryProps {
  unlockedImages: string[];
  onImageClick: (imagePath: string) => void;
}

function GothAchievementsGallery({ unlockedImages, onImageClick }: GothAchievementsGalleryProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => new Set([...prev, imagePath]));
  };

  return (
    <Box sx={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h5" component="h3" sx={{ fontFamily: "var(--gothic-heading)", color: "var(--text-color)" }}>
        Unlocked Goth Girls
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px", justifyContent: "center" }}>
        {unlockedImages.length > 0 ? (
          unlockedImages.map((imagePath, index) => (
            !imageErrors.has(imagePath) && (
              <img
                key={`${imagePath}-${index}`}
                src={imagePath}
                alt={`Unlocked Goth Girl ${index + 1}`}
                loading="lazy"
                onError={() => handleImageError(imagePath)}
                onClick={() => onImageClick(imagePath)}
                style={{
                  width: "100px",
                  height: "150px",
                  objectFit: "cover",
                  border: "2px solid #ff00ff",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  borderRadius: "8px"
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLImageElement).style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLImageElement).style.transform = "scale(1)";
                }}
              />
            )
          ))
        ) : (
          <Typography variant="body1" component="p" sx={{ color: "var(--text-color)" }}>
            No goth girls unlocked yet. Format some JSON!
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default GothAchievementsGallery;