import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";

function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("features.validation.title", "Real-Time JSON Validation"),
      description: t("features.validation.desc", "Instantly validate your JSON with detailed error messages, line numbers, and code snippets to help you fix issues quickly.")
    },
    {
      title: t("features.formatting.title", "Advanced Formatting"),
      description: t("features.formatting.desc", "Format and beautify JSON with customizable indentation (2, 4, 6, or 8 spaces). Choose from multiple viewer themes.")
    },
    {
      title: t("features.multipage.title", "Multi-Page Documents"),
      description: t("features.multipage.desc", "Work with multiple JSON documents simultaneously using our tabbed pagination system. Switch between pages without losing your work.")
    },
    {
      title: t("features.themes.title", "Customizable Themes"),
      description: t("features.themes.desc", "Select from multiple JSON viewer themes including Monokai, Apathy, and Bright. Match your preferred coding style.")
    },
    {
      title: t("features.private.title", "100% Private & Client-Side"),
      description: t("features.private.desc", "All processing happens in your browser. No data is sent to any server. Your JSON stays completely private.")
    },
    {
      title: t("features.offline.title", "Works Offline"),
      description: t("features.offline.desc", "Once loaded, JGoth Validator works without an internet connection. Format and validate JSON anywhere, anytime.")
    },
  ];

  return (
    <Box className="features-section">
      <Container maxWidth="lg" className="features-section__container">
        <Typography 
          component="h2" 
          variant="h2"
          className="features-section__title"
        >
          {t("features.title", "Why Choose JGoth Validator?")}
        </Typography>
        
        <Grid2 container spacing={3} className="features-section__grid">
          {features.map((feature, idx) => (
            <Grid2 key={idx} xs={12} sm={6} md={4}>
              <Box className="features-section__card">
                <Typography 
                  component="h3" 
                  variant="h6"
                  className="features-section__card-title"
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2"
                  className="features-section__card-description"
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
