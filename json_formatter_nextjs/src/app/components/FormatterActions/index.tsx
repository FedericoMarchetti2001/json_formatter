// @mui material components
import { InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

export interface IFormatterActionsProps {
  //original text
  textToManage: string;
  setTextToManage: (text: string) => void;
  //validity original text
  isValid: boolean;
  setIsValid: (isValid: boolean) => void;
  setGenericError: (error: string) => void;
  //processed text
  processedText: string;
  setProcessedText: (text: string) => void;
  // goth: callback after conversion
  onConvert?: (result: { success: boolean }) => void;
}

//This is a row/column component, possibly a small flexbox, which will contain actions like "Format", "Copy", "Clear", etc.
export default function FormatterAction(
  props: IFormatterActionsProps
): React.ReactElement<IFormatterActionsProps> {
  const [tabSpaces, setTabSpaces] = React.useState<number>(2);
  const buttonWidth = 100;

  //Check if the text is JSON or not, and format according to the tabSpaces
  const format = (textToValidate: string, tabSpaces: number): string => {
    //if it can't convert to JSON, it's not valid and will be catched
    try {
      console.log("Validate JSON text, ", textToValidate);
      JSON.parse(textToValidate);
      props.setIsValid(true);
      console.log("Valid JSON");
      return JSON.stringify(JSON.parse(textToValidate), null, tabSpaces);
    } catch (e) {
      console.log("Invalid JSON ", e);
      props.setIsValid(false);
      return "";
    }
  };

  //Copy the text to the clipboard
  const copy = (textToCopy: string): void => {
    try {
      console.log("Copy text, ", textToCopy);
      navigator.clipboard.writeText(textToCopy);
    } catch (e) {
      console.error("Error copying text", e);
      props.setGenericError("Error copying text");
    }
  };

  //Clear the text
  const clear = (): void => {
    try {
      console.log("Clear text");
      props.setTextToManage("");
    } catch (e) {
      console.error("Error clearing text: ", e);
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
      console.log("Error uploading file ", e);
      props.setGenericError("Error uploading file");
    }
  };

  return (
    <React.Fragment>
      <Grid2
        container
        direction="column"
        height="50%"
        justifyContent="center"
        alignItems="stretch"
        style={{ padding: "10px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%",
          }}
        >
          <Button
            className="primary-button"
            sx={{ width: buttonWidth }}
            variant="contained"
            color="primary"
            onClick={() => {
              const formattedText = format(props.textToManage, tabSpaces);
              props.setProcessedText(formattedText);
              if (props.onConvert) {
                props.onConvert({ success: formattedText !== "" });
              }
            }}
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
        height="50%"
        justifyContent="center"
        alignItems="stretch"
        style={{ padding: "10px" }}
      >
        <InputLabel>Upload JSON</InputLabel>
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
            autoWidth
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
