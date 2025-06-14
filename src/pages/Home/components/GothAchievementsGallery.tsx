import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface GothAchievementsGalleryProps {
  unlockedImages: string[];
  onImageClick: (imagePath: string) => void;
}

function GothAchievementsGallery({ unlockedImages, onImageClick }: GothAchievementsGalleryProps) {
  return (
    <Box sx={{ marginTop: "20px", textAlign: "center" }}>
      <Typography variant="h5" component="h3" sx={{ fontFamily: "var(--gothic-heading)", color: "var(--text-color)" }}>
        Unlocked Goth Girls
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
        {unlockedImages.length > 0 ? (
          unlockedImages.map((imagePath, index) => (
            <img
              key={index}
              src={imagePath}
              alt={`Unlocked Goth Girl ${index + 1}`}
              style={{
                width: "100px",
                height: "150px",
                objectFit: "cover",
                border: "2px solid #ff00ff",
                cursor: "pointer", // Indicate clickable
              }}
              onClick={() => onImageClick(imagePath)}
            />
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