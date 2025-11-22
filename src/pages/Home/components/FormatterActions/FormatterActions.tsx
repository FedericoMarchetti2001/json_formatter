// @mui material components
import { InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { validateJson, JsonValidationResult } from "../../../../core/json-validator";
import localStorageHandler from "../../../../utils/localStorageHandler";

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
}

//This is a row/column component, possibly a small flexbox, which will contain actions like "Format", "Copy", "Clear", etc.
export default function FormatterAction(
  props: IFormatterActionsProps
): React.ReactElement<IFormatterActionsProps> {
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
    <React.Fragment>
      <Grid2
        container
        direction="column"
        height="35vh"
        justifyContent="center"
        alignItems="stretch"
        style={{ padding: "10px", paddingTop: "10vh"}}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%"
          }}
        >
          <Button
            className="primary-button"
            sx={{ width: buttonWidth }}
            variant="contained"
            color="primary"
            onClick={() => {
              // Check for "Perfect JSON" achievement before formatting
              try {
                JSON.parse(props.textToManage);
                if (!(props.achievements.unlocked.indexOf("Perfect JSON") !== -1)) {
                  props.setAchievements((prev: { unlocked: string[]; images: string[] }) => ({
                    ...prev,
                    unlocked: [...prev.unlocked, "Perfect JSON"],
                    images: [...new Set([...prev.images, "/goth-girls/goth3.jpeg"])], // Add image, prevent duplicates
                  }));
                  console.log("Achievement unlocked: Perfect JSON");
                }
              } catch (e) {
                // Not a perfect JSON, do nothing for this achievement
              }

              handleFormat();
            }}
            ref={formatButtonRef}
            title="Format (Alt+Enter)"
          >
            <b style={{ color: "white" }}>Format</b>
          </Button>
          <Button
            className="primary-button"
            sx={{ width: buttonWidth }}
            variant="contained"
            color="primary"
            onClick={() => copy(props.textToManage)}
          >
            <b style={{ color: "white" }}>Copy</b>
          </Button>
          <Button
            className="primary-button"
            sx={{ width: buttonWidth }}
            variant="contained"
            color="primary"
            onClick={() => clear()}
          >
            <b style={{ color: "white" }}>Clear</b>
          </Button>
        </div>
      </Grid2>
      <Grid2
        container
        direction="column"
        height="45vh"
        justifyContent="center"
        alignItems="stretch"
        style={{ padding: "10px"}}
      >
        <InputLabel style={{ color: "white" }}>Upload JSON</InputLabel>
        <input
          type="file"
          accept=".json,.txt"
          onChange={(e) => upload(e.target.files?.item(0) as File)}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
          <InputLabel id="tab-spaces--autowidth-label" className="goth-input-label">
            Tab spaces
          </InputLabel>
          <Select
            className={"menu-select"}
            labelId="tab-spaces--autowidth-label"
            id="tab-spaces-select-autowidth"
            value={tabSpaces}
            onChange={(e) => setTabSpaces(e.target.value as number)}
            label="Tab spaces"
          >
            <MenuItem className={"menu-item"} value={2}>
              Two
            </MenuItem>
            <MenuItem className={"menu-item"} value={4}>
              Four
            </MenuItem>
            <MenuItem className={"menu-item"} value={6}>
              Six
            </MenuItem>
            <MenuItem className={"menu-item"} value={8}>
              Eigth
            </MenuItem>
          </Select>
        </div>
      </Grid2>
    </React.Fragment>
  );
}
