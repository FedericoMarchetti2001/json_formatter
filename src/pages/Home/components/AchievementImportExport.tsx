import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

interface AchievementImportExportProps {
  onExport: () => void;
  onImport: (data: string) => void;
}

function AchievementImportExport({ onExport, onImport }: AchievementImportExportProps) {
  const { t } = useTranslation();

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
          alert(
            t(
              "AchievementImportExport.invalidFile",
              "Invalid achievements file. Please select a valid JSON file."
            )
          );
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box className="achievement-import-export">
      <Box className="achievement-import-export__actions">
        <Button
          onClick={onExport}
          className="secondary-button"
          variant="contained"
          color="primary"
        >
          {t("AchievementImportExport.export", "Export Achievements")}
        </Button>
        <input
          accept=".json"
          className="achievement-import-export__file-input"
          id="import-achievements-button"
          type="file"
          onChange={handleImport}
        />
        <label htmlFor="import-achievements-button">
          <Button
            className="secondary-button"
            variant="contained"
            color="primary"
          >
            {t("AchievementImportExport.import", "Import Achievements")}
          </Button>
        </label>
      </Box>
    </Box>
  );
}

export default AchievementImportExport;
