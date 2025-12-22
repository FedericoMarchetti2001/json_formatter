// @mui material components
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// Import Material-UI icons
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  ACHIEVEMENT_IMAGES,
  AchievementEvent,
  checkAchievements,
} from "../../../../config/achievements";
import { validateJson, JsonValidationResult } from "../../../../core/json-validator";
import localStorageHandler from "../../../../utils/localStorageHandler";
import {
  DEFAULT_EDITOR_FONT_PRESET,
  DEFAULT_EDITOR_LINE_SPACING,
  EDITOR_FONT_PRESETS,
  EDITOR_LINE_SPACINGS,
  EditorFontPreset,
  EditorLineSpacing,
} from "../../../../types/editorPreferences";

export interface IFormatterActionsProps {
  pageId: string;
  //original text
  textToManage: string;
  setTextToManage: (text: string) => void;
  //validity original text
  setValidationResultForPage: (pageId: string, result: JsonValidationResult) => void;
  setGenericError: (error: string) => void;
  //processed text
  processedText: string;
  setProcessedText: (text: string) => void;
  // goth: callback after conversion
  onConvert?: (result: { success: boolean }) => void;
  // Achievements
  achievements: { unlocked: string[]; images: string[] };
  setAchievements: React.Dispatch<React.SetStateAction<{ unlocked: string[]; images: string[] }>>;
  editorFontPreset: EditorFontPreset;
  editorLineSpacing: EditorLineSpacing;
  setEditorFontPreset: (preset: EditorFontPreset) => void;
  setEditorLineSpacing: (spacing: EditorLineSpacing) => void;
}

//This is a row/column component, possibly a small flexbox, which will contain actions like "Format", "Copy", "Clear", etc.
export default function FormatterAction(
  props: IFormatterActionsProps
): React.ReactElement<IFormatterActionsProps> {
  const { t } = useTranslation();
  const [tabSpaces, setTabSpaces] = React.useState<number>(2);

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

  // Ref for the Format button logic, so it can be triggered by keyboard
  const formatButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleFormat = (validationResult: JsonValidationResult) => {
    if (props.pageId) {
      props.setValidationResultForPage(props.pageId, validationResult);
    }

    if (validationResult.valid) {
      const formatted = JSON.stringify(JSON.parse(props.textToManage), null, tabSpaces);
      props.setProcessedText(formatted);
      if (props.onConvert) {
        props.onConvert({ success: true });
      }
    } else {
      props.setProcessedText("");
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

  const handleDecreaseFont = (): void => {
    const currentIndex = EDITOR_FONT_PRESETS.indexOf(props.editorFontPreset);
    if (currentIndex > 0) {
      props.setEditorFontPreset(EDITOR_FONT_PRESETS[currentIndex - 1]);
    }
  };

  const handleIncreaseFont = (): void => {
    const currentIndex = EDITOR_FONT_PRESETS.indexOf(props.editorFontPreset);
    if (currentIndex >= 0 && currentIndex < EDITOR_FONT_PRESETS.length - 1) {
      props.setEditorFontPreset(EDITOR_FONT_PRESETS[currentIndex + 1]);
    }
  };

  const handleResetTypography = (): void => {
    props.setEditorFontPreset(DEFAULT_EDITOR_FONT_PRESET);
    props.setEditorLineSpacing(DEFAULT_EDITOR_LINE_SPACING);
  };

  return (
    <Box className="formatter-action-grid">
      {/* <Grid2 className="formatter-typography-panel" container>
        <Box className="formatter-typography-panel-controls">
          <FormControl className="goth-typography-control">
            <InputLabel id="editor-font-label" className="goth-input-label">
              {t("EditorTypography.textSize")}
            </InputLabel>
            <Select
              className="menu-select"
              labelId="editor-font-label"
              id="editor-font-select"
              value={props.editorFontPreset}
              onChange={(event) => props.setEditorFontPreset(event.target.value as EditorFontPreset)}
            >
              <MenuItem className="menu-item" value="xs">
                {t("EditorTypography.xs")}
              </MenuItem>
              <MenuItem className="menu-item" value="s">
                {t("EditorTypography.s")}
              </MenuItem>
              <MenuItem className="menu-item" value="m">
                {t("EditorTypography.m")}
              </MenuItem>
              <MenuItem className="menu-item" value="l">
                {t("EditorTypography.l")}
              </MenuItem>
              <MenuItem className="menu-item" value="xl">
                {t("EditorTypography.xl")}
              </MenuItem>
            </Select>
          </FormControl>
          <div className="goth-typography-quick">
            <Tooltip title={t("EditorTypography.decrease")}>
              <span>
                <IconButton
                  aria-label={t("EditorTypography.decrease")}
                  size="small"
                  onClick={handleDecreaseFont}
                  disabled={EDITOR_FONT_PRESETS.indexOf(props.editorFontPreset) === 0}
                >
                  <RemoveIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t("EditorTypography.increase")}>
              <span>
                <IconButton
                  aria-label={t("EditorTypography.increase")}
                  size="small"
                  onClick={handleIncreaseFont}
                  disabled={
                    EDITOR_FONT_PRESETS.indexOf(props.editorFontPreset) ===
                    EDITOR_FONT_PRESETS.length - 1
                  }
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        </Box>
        <Box className="formatter-typography-panel-controls">
          <FormControl className="goth-typography-control">
            <InputLabel id="editor-spacing-label" className="goth-input-label">
              {t("EditorTypography.lineSpacing")}
            </InputLabel>
            <Select
              className="menu-select"
              labelId="editor-spacing-label"
              id="editor-spacing-select"
              value={props.editorLineSpacing}
              onChange={(event) =>
                props.setEditorLineSpacing(event.target.value as EditorLineSpacing)
              }
            >
              {EDITOR_LINE_SPACINGS.map((spacing) => (
                <MenuItem key={spacing} className="menu-item" value={spacing}>
                  {t(`EditorTypography.${spacing}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title={t("EditorTypography.reset")}>
            <IconButton
              aria-label={t("EditorTypography.reset")}
              size="small"
              onClick={handleResetTypography}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid2> */}
      <Grid2
        className="formatter-action-upload-container"
        container
        direction="column"
      >
        <InputLabel className="formatter-action-upload-label">
          {t("FormatterActions.upload_json")}
        </InputLabel>
        <input
          type="file"
          accept=".json,.txt"
          onChange={(e) => upload(e.target.files?.item(0) as File)}
        />
      </Grid2>
      <Grid2
        className="formatter-action-buttons-container"
        container
        direction="column"
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
                newlyUnlocked.forEach((a) => toast.warn(`Achievement unlocked: ${a.name}`));
              }
              i18n.changeLanguage(code.toLowerCase());
            }}
          /> */}
          <Button
            className="primary-button formatter-action-button"
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
                newlyUnlocked.forEach((a) => toast.warn(`Achievement unlocked: ${a.name}`, { icon: () =>  <EmojiEventsIcon /> }) );
              }
              
              setSuccessfulFormats(prev => prev + 1);
              handleFormat(validationResult);
            }}
            ref={formatButtonRef}
            title="Format (Alt+Enter)"
            startIcon={<FormatAlignLeftIcon className="button-icon" />}
          >
            <span className="formatter-action-button__label">{t("FormatterActions.format")}</span>
        </Button>
        <Button
          className="primary-button formatter-action-button"
          variant="contained"
          color="primary"
          onClick={() => copy(props.textToManage)}
            startIcon={<ContentCopyIcon className="button-icon" />}
          >
            <span className="formatter-action-button__label">{t("FormatterActions.copy")}</span>
        </Button>
        <Button
          className="primary-button formatter-action-button"
          variant="contained"
          color="primary"
          onClick={() => clear()}
          startIcon={<ClearIcon className="button-icon" />}
        >
          <span className="formatter-action-button__label">{t("FormatterActions.clear")}</span>
        </Button>
      </Grid2>
    </Box>
  );
}
