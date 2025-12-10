// @mui material components
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
// Import Material-UI icons
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import {
  ACHIEVEMENT_IMAGES,
  AchievementEvent,
  checkAchievements,
} from "../../../../config/achievements";
import { validateJson, JsonValidationResult } from "../../../../core/json-validator";
import localStorageHandler from "../../../../utils/localStorageHandler";
import ReactFlagsSelect from "react-flags-select";
import i18n from "i18n";

export interface IFormatterActionsProps {
  //original text
  textToManage: string;
  setTextToManage: (text: string) => void;
  //validity original text
  setValidationResult: (result: JsonValidationResult) => void;
  setGenericError: (error: string) => void;
  //processed text
  processedText: string;
  setProcessedText: (text: string) => void;
  // goth: callback after conversion
  onConvert?: (result: { success: boolean }) => void;
  // Achievements
  achievements: { unlocked: string[]; images: string[] };
  setAchievements: React.Dispatch<React.SetStateAction<{ unlocked: string[]; images: string[] }>>;
  // Theme
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
}

//This is a row/column component, possibly a small flexbox, which will contain actions like "Format", "Copy", "Clear", etc.
export default function FormatterAction(
  props: IFormatterActionsProps
): React.ReactElement<IFormatterActionsProps> {
  const { t } = useTranslation();
  const [tabSpaces, setTabSpaces] = React.useState<number>(2);
  const { selectedTheme, setSelectedTheme } = props;

  // Load tabSpaces from preferences on mount
  React.useEffect(() => {
    const prefs = localStorageHandler.getPreferences();
    if (prefs && typeof prefs.tabSpaces === "number") {
      setTabSpaces(prefs.tabSpaces);
    }
  }, []);

  // Save tabSpaces to preferences when changed
  React.useEffect(() => {
    localStorageHandler.updatePreference("tabSpaces", tabSpaces);
  }, [tabSpaces]);
  const [successfulFormats, setSuccessfulFormats] = React.useState<number>(0); // State for successful formats count
  const buttonWidth = 100;

  // Ref for the Format button logic, so it can be triggered by keyboard
  const formatButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleFormat = () => {
    const validationResult = validateJson(props.textToManage);
    props.setValidationResult(validationResult);

    if (validationResult.valid) {
      const formatted = JSON.stringify(JSON.parse(props.textToManage), null, tabSpaces);
      props.setProcessedText(formatted);
      // Goth theme success
      if (props.onConvert) {
        props.onConvert({ success: true });
      }
    } else {
      props.setProcessedText(""); // Clear processed text on error
      // Goth theme failure
      if (props.onConvert) {
        props.onConvert({ success: false });
      }
    }
  };

  //Copy the text to the clipboard
  const copy = (textToCopy: string): void => {
    try {
      console.log("Copy text, ", textToCopy);
      navigator.clipboard.writeText(textToCopy);
    } catch (e) {
      console.error("Error copying text");
      props.setGenericError("Error copying text");
    }
  };

  //Clear the text
  const clear = (): void => {
    try {
      console.log("Clear text");
      props.setTextToManage("");
    } catch (e) {
      console.error("Error clearing text");
      props.setGenericError("Error clearing text");
    }
  };

  //upload file (must be txt or json)
  const upload = (file: File): void => {
    try {
      if (file.type === "application/json" || file.type === "text/plain") {
        console.log("Upload file, ", file);
        const reader = new FileReader();
        reader.onload = (e) => {
          props.setTextToManage((e?.target?.result as string) ?? "");
        };
        reader.readAsText(file);
      } else {
        console.error("File type not allowed");
        props.setGenericError("File type not allowed");
      }
    } catch (e) {
      console.log("Error uploading file");
      props.setGenericError("Error uploading file");
    }
  };

  // ALT+ENTER triggers Format
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Enter") {
        e.preventDefault();
        // Simulate Format button click
        if (formatButtonRef.current) {
          formatButtonRef.current.click();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Box className="formatter-action-grid">
      <Grid2
        className="formatter-action-buttons-container"
        container
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
          padding: { xs: "0.5rem", md: "10px" },
          paddingTop: { xs: "2rem", md: "10vh" },
          gap: { xs: 1, md: 2 }
        }}
      >
          {/* <ReactFlagsSelect
            countries={["US", "DE"]}
            customLabels={{ US: "English", DE: "Deutsch" }}
            selected={i18n.language}
            onSelect={(code) => {
              const newlyUnlocked = checkAchievements(
                AchievementEvent.CHANGE_LANGUAGE,
                props.achievements.unlocked,
                {}
              );
              if (newlyUnlocked.length > 0) {
                props.setAchievements((prev) => {
                  const newAchievements = newlyUnlocked.map((a) => a.id);
                  const newImages = newlyUnlocked.map((a) => ACHIEVEMENT_IMAGES[a.imageKey]);
                  return {
                    ...prev,
                    unlocked: [...prev.unlocked, ...newAchievements],
                    images: [...new Set([...prev.images, ...newImages])],
                  };
                });
                newlyUnlocked.forEach((a) => toast.success(`Achievement unlocked: ${a.name}`));
              }
              i18n.changeLanguage(code.toLowerCase());
            }}
          /> */}
          <Button
            className="primary-button formatter-action-button"
            sx={{ width: buttonWidth }}
            variant="contained"
            color="primary"
            onClick={() => {
              const validationResult = validateJson(props.textToManage);
              const event = validationResult.valid
                ? AchievementEvent.FORMAT_SUCCESS
                : AchievementEvent.FORMAT_FAILURE;

              const context = {
                previousText: props.processedText,
                currentText: props.textToManage,
                successfulFormatsCount: successfulFormats + 1,
              };

              const newlyUnlocked = checkAchievements(event, props.achievements.unlocked, context);

              if (newlyUnlocked.length > 0) {
                props.setAchievements((prev) => {
                  const newAchievements = newlyUnlocked.map((a) => a.id);
                  const newImages = newlyUnlocked.map((a) => ACHIEVEMENT_IMAGES[a.imageKey]);
                  return {
                    ...prev,
                    unlocked: [...prev.unlocked, ...newAchievements],
                    images: [...new Set([...prev.images, ...newImages])],
                  };
                });
                newlyUnlocked.forEach((a) => toast.success(`Achievement unlocked: ${a.name}`));
              }
              
              setSuccessfulFormats(prev => prev + 1);
              handleFormat();
            }}
            ref={formatButtonRef}
            title="Format (Alt+Enter)"
            startIcon={<FormatAlignLeftIcon className="button-icon" />}
          >
            <b style={{ color: "white" }}>{t("FormatterActions.format")}</b>
        </Button>
        <Button
          className="primary-button formatter-action-button"
          sx={{ 
            width: { xs: "100%", md: buttonWidth },
            minWidth: { xs: "auto", md: buttonWidth }
          }}
          variant="contained"
          color="primary"
          onClick={() => copy(props.textToManage)}
            startIcon={<ContentCopyIcon className="button-icon" />}
          >
            <b style={{ color: "white" }}>{t("FormatterActions.copy")}</b>
        </Button>
        <Button
          className="primary-button formatter-action-button"
          sx={{ 
            width: { xs: "100%", md: buttonWidth },
            minWidth: { xs: "auto", md: buttonWidth }
          }}
          variant="contained"
          color="primary"
          onClick={() => clear()}
          startIcon={<ClearIcon className="button-icon" />}
        >
          <b style={{ color: "white" }}>{t("FormatterActions.clear")}</b>
        </Button>
      </Grid2>
      <Grid2
        container
        direction="column"
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
          padding: { xs: "0.5rem", md: "10px" },
          gap: { xs: 1.5, md: 2 }
        }}
      >
        <InputLabel sx={{ color: "white", fontSize: { xs: "0.875rem", md: "1rem" } }}>
          {t("FormatterActions.upload_json")}
        </InputLabel>
        <input
          type="file"
          accept=".json,.txt"
          onChange={(e) => upload(e.target.files?.item(0) as File)}
        />
        <Grid2 sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <InputLabel id="tab-spaces--autowidth-label" className="goth-input-label">
            {t("FormatterActions.tab_spaces")}
          </InputLabel>
          <Select
            className={"menu-select"}
            labelId="tab-spaces--autowidth-label"
            id="tab-spaces-select-autowidth"
            value={tabSpaces}
            onChange={(e) => {
              setTabSpaces(e.target.value as number);
              const newlyUnlocked = checkAchievements(
                AchievementEvent.CHANGE_INDENTATION,
                props.achievements.unlocked,
                {}
              );

              if (newlyUnlocked.length > 0) {
                props.setAchievements((prev) => {
                  const newAchievements = newlyUnlocked.map((a) => a.id);
                  const newImages = newlyUnlocked.map((a) => ACHIEVEMENT_IMAGES[a.imageKey]);
                  return {
                    ...prev,
                    unlocked: [...prev.unlocked, ...newAchievements],
                    images: [...new Set([...prev.images, ...newImages])],
                  };
                });
                newlyUnlocked.forEach((a) => toast.success(`Achievement unlocked: ${a.name}`));
              }
            }}
            label="Tab spaces"
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <MenuItem className={"menu-item"} value={2}>
              {t("FormatterActions.two")}
            </MenuItem>
            <MenuItem className={"menu-item"} value={4}>
              {t("FormatterActions.four")}
            </MenuItem>
            <MenuItem className={"menu-item"} value={6}>
              {t("FormatterActions.six")}
            </MenuItem>
            <MenuItem className={"menu-item"} value={8}>
              {t("FormatterActions.eight")}
            </MenuItem>
          </Select>
        </Grid2>
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
            <MenuItem className={"menu-item"} value={"monokai"}>{t("FormatterActions.monokai")}</MenuItem>
            <MenuItem className={"menu-item"} value={"apathy"}>{t("FormatterActions.apathy")}</MenuItem>
            <MenuItem className={"menu-item"} value={"bright"}>{t("FormatterActions.bright")}</MenuItem>
          </Select>
        </Grid2>
      </Grid2>
    </Box>
  );
}