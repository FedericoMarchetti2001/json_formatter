// @mui material components
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

export interface IFormatterActionsProps {
  textToManage: string;
  setTextToManage: (text: string) => void;
  isValid : boolean;
  setIsValid : (isValid : boolean) => void;
  setGenericError : (error : string) => void;
}

//This is a row/column component, possibly a small flexbox, which will contain actions like "Format", "Copy", "Clear", etc.
export default function FormatterAction(props : IFormatterActionsProps) : React.ReactElement<IFormatterActionsProps> {

  //Check if the text is JSON or not
  const format = (textToValidate: string) : void => {
    //if it can't convert to JSON, it's not valid and will be catched
    try {
      console.log("Validate JSON text, ", textToValidate);
      JSON.parse(textToValidate); 
      props.setIsValid(true);
      console.log("Valid JSON");
    } catch (e) {
      console.log("Invalid JSON");
      props.setIsValid(false);
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
    <Grid2 container direction="column" justifyContent="space-between" alignItems="stretch" style={{ padding: "10px" }}>
      <Grid2>
        <Button variant="contained" color="primary" onClick={() => format(props.textToManage)}>
          Format
        </Button>
      </Grid2>
      <Grid2 >
        <Button variant="contained" color="primary" onClick={() => copy(props.textToManage)}>
          Copy
        </Button>
      </Grid2>
      <Grid2 >
        <Button variant="contained" color="primary" onClick={() => clear()}>
          Clear
        </Button>
      </Grid2>
      <Grid2 >
        <input type="file" accept=".json,.txt" onChange={(e) => upload(e.target.files?.item(0) as File)} />
      </Grid2>
    </Grid2>
  );
}
