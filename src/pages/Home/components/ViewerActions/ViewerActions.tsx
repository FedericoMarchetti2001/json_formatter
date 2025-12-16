// @mui material components
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { useTranslation } from "react-i18next";

export interface IViewerActionsProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
}

export default function ViewerActions(props: IViewerActionsProps): React.ReactElement<IViewerActionsProps> {
  const { t } = useTranslation();
  const { selectedTheme, setSelectedTheme } = props;

  return (
    <Box className="viewer-actions-grid">
      <Grid2
        className="viewer-actions-container"
        container
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
          padding: { xs: "0.5rem", md: "10px" },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        <Grid2 sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <InputLabel id="json-theme-label" className="goth-input-label">
            {t("FormatterActions.viewer_theme")}
          </InputLabel>
          <Select
            className={"menu-select"}
            labelId="json-theme-label"
            id="json-theme-select"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as string)}
            label="Viewer Theme"
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <MenuItem className={"menu-item"} value={"monokai"}>
              {t("FormatterActions.monokai")}
            </MenuItem>
            <MenuItem className={"menu-item"} value={"apathy"}>
              {t("FormatterActions.apathy")}
            </MenuItem>
            <MenuItem className={"menu-item"} value={"bright"}>
              {t("FormatterActions.bright")}
            </MenuItem>
          </Select>
        </Grid2>
      </Grid2>
    </Box>
  );
}
