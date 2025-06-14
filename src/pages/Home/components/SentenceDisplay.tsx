import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SentenceDisplayProps {
  sentence: string;
}

function SentenceDisplay({ sentence }: SentenceDisplayProps) {
  return (
    <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
      <Typography className="goth-sentence"  variant="h5" component="p" sx={{ fontFamily: "var(--gothic-heading)", color: "var(--text-color)" }}>
        {sentence}
      </Typography>
    </Box>
  );
}

export default SentenceDisplay;