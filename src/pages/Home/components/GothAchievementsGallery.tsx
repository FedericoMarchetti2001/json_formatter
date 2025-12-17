import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface GothAchievementsGalleryProps {
  unlockedImages: string[];
  onImageClick: (imagePath: string) => void;
}

function GothAchievementsGallery({ unlockedImages, onImageClick }: GothAchievementsGalleryProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => new Set([...prev, imagePath]));
  };

  return (
    <Box className="goth-achievements-gallery">
      <Typography variant="h5" component="h3" className="goth-achievements-gallery__title">
        {t("GothAchievementsGallery.title", "Unlocked Goth Girls")}
      </Typography>
      <Box
        className="goth-achievements-carousel"
        aria-label={t("GothAchievementsGallery.carouselLabel", "Unlocked goth girls carousel")}
      >
        {unlockedImages.length > 0 ? (
          unlockedImages.map((imagePath, index) => (
            !imageErrors.has(imagePath) && (
              <img
                key={`${imagePath}-${index}`}
                src={imagePath}
                alt={t("GothAchievementsGallery.alt", {
                  index: index + 1,
                  defaultValue: "Unlocked Goth Girl {{index}}",
                })}
                loading="lazy"
                onError={() => handleImageError(imagePath)}
                onClick={() => onImageClick(imagePath)}
                className="goth-achievements-carousel__image"
              />
            )
          ))
        ) : (
          <Typography variant="body1" component="p" className="goth-achievements-gallery__empty">
            {t("GothAchievementsGallery.empty", "No goth girls unlocked yet. Format some JSON!")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default GothAchievementsGallery;
