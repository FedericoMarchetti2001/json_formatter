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
        className="viewer-actions-container viewer-actions-container--inner"
        container
        direction="column"
      >
        <Grid2 className="viewer-actions-layout__row">
          <InputLabel id="json-theme-label" className="goth-input-label">
            {t("FormatterActions.viewer_theme")}
          </InputLabel>
          <Select
            className="menu-select viewer-actions-select"
            labelId="json-theme-label"
            id="json-theme-select"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as string)}
            label="Viewer Theme"
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
