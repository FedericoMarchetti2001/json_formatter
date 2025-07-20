import React from "react";
import Box from "@mui/material/Box";

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
      <Box>
        <button onClick={onExport} style={{ marginRight: "10px" }}>
          Export Achievements
        </button>
        <input
          accept=".json"
          style={{ display: "none" }}
          id="import-achievements-button"
          type="file"
          onChange={handleImport}
        />
        <label htmlFor="import-achievements-button">
          <button>
            Import Achievements
          </button>
        </label>
      </Box>
    </Box>
  );
}

export default AchievementImportExport;