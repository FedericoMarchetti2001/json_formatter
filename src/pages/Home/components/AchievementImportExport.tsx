import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface AchievementImportExportProps {
  onExport: () => void;
  onImport: (data: string) => void;
}

function AchievementImportExport({ onExport, onImport }: AchievementImportExportProps) {
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          // Basic validation: check if it's valid JSON
          JSON.parse(content);
          onImport(content);
        } catch (error) {
          console.error("Failed to parse imported achievements:", error);
          alert("Invalid achievements file. Please select a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ marginTop: "20px", textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Button variant="contained" color="primary" onClick={onExport}>
          Export Achievements
        </Button>
        <input
          accept=".json"
          style={{ display: "none" }}
          id="import-achievements-button"
          type="file"
          onChange={handleImport}
        />
        <label htmlFor="import-achievements-button">
          <Button variant="contained" color="secondary" component="span">
            Import Achievements
          </Button>
        </label>
      </Box>
    </Box>
  );
}

export default AchievementImportExport;