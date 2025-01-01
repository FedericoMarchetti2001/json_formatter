// @mui material components
import { Label } from "@mui/icons-material";
import { InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

export interface IFormatterActionsProps {

  //original text
  textToManage: string;
  setTextToManage: (text: string) => void;
  //validity original text
  isValid : boolean;
  setIsValid : (isValid : boolean) => void;
  setGenericError : (error : string) => void;
  //processed text
  processedText : string;
  setProcessedText : (text : string) => void;
}

//This is a row/column component, possibly a small flexbox, which will contain actions like "Format", "Copy", "Clear", etc.
export default function FormatterAction(props : IFormatterActionsProps) : React.ReactElement<IFormatterActionsProps> {

  const [tabSpaces, setTabSpaces] = React.useState<number>(2);
  const buttonWidth = 100;

  //Check if the text is JSON or not, and format according to the tabSpaces
  const format = (textToValidate: string, tabSpaces : number) : string  => {
    //if it can't convert to JSON, it's not valid and will be catched
    try {
      console.log("Validate JSON text, ", textToValidate);
      JSON.parse(textToValidate); 
      props.setIsValid(true);
      console.log("Valid JSON");
      return JSON.stringify(JSON.parse(textToValidate), null, tabSpaces);
    } catch (e) {
      console.log("Invalid JSON");
      props.setIsValid(false);
      return "";
    }
  }

  //Copy the text to the clipboard
  const copy = (textToCopy : string) : void => {
    try{
      console.log("Copy text, ", textToCopy);
      navigator.clipboard.writeText(textToCopy);
    }
    catch(e){
      console.error("Error copying text");
      props.setGenericError("Error copying text");
    }
  }

  //Clear the text
  const clear = () : void => {
    try{
      console.log("Clear text");
      props.setTextToManage("");
    }
    catch(e){
      console.error("Error clearing text");
      props.setGenericError("Error clearing text");
    }
  }

  //upload file (must be txt or json)
  const upload = (file : File) : void => {
    try{
      if(file.type === "application/json" || file.type === "text/plain"){
        console.log("Upload file, ", file);
        const reader = new FileReader();
        reader.onload = (e) => {
          props.setTextToManage(e?.target?.result as string ?? "");
        }
        reader.readAsText(file);
      }
      else{
        console.error("File type not allowed");
        props.setGenericError("File type not allowed");
      }
    }
    catch(e){
      console.log("Error uploading file");
      props.setGenericError("Error uploading file");
    }
  }

  return (
    <Grid2 xs={2} xl={2} container direction="column" justifyContent="space-between" alignItems="stretch" style={{ padding: "10px" }}>
      <Grid2 container direction="column">
        <Grid2 container direction={"column"} sx={{ display: 'flex', width: buttonWidth }}>
          <InputLabel id="tab-spaces--autowidth-label">Tab spaces</InputLabel>
          <Select
            labelId="tab-spaces--autowidth-label"
            id="tab-spaces-select-autowidth"
            value={tabSpaces}
            onChange={(e) => setTabSpaces(e.target.value as number)}
            autoWidth
            label="Tab spaces"
          >
            <MenuItem value={2}>Two</MenuItem>
            <MenuItem value={4}>Four</MenuItem>
            <MenuItem value={6}>Six</MenuItem>
            <MenuItem value={8}>Eigth</MenuItem>
          </Select>
        </Grid2>
        <Grid2 sx={{ display: 'flex'}}>
          <Button sx={{width: buttonWidth}} variant="contained" color="primary" onClick={() =>{
              const formattedText = format(props.textToManage , tabSpaces);
              props.setProcessedText(formattedText);
            }}>
            <b style={{ color: "white" }}>Format</b>
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 >
        <Button sx={{ width: buttonWidth }} variant="contained" color="primary" onClick={() => copy(props.textToManage)}>
          <b style={{ color: "white" }}>Copy</b>
        </Button>
      </Grid2>
      <Grid2 >
        <Button sx={{ width: buttonWidth }} variant="contained" color="primary" onClick={() => clear()}>
          <b style={{ color: "white" }}>Clear</b>
        </Button>
      </Grid2>
      <Grid2 >
        <input type="file" accept=".json,.txt" onChange={(e) => upload(e.target.files?.item(0) as File)} />
      </Grid2>
    </Grid2>
  );
}
