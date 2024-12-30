// @mui material components
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

export interface IFormatterActionsProps {
  textToManage: string;
  setTextToManage: (text: string) => void;
}

//This is a row/column component, possibly a small flexbox, which will contain actions like "Format", "Copy", "Clear", etc.
export default function FormatterAction(props : IFormatterActionsProps) : React.ReactElement<IFormatterActionsProps> {

  //Check if the text is JSON or not
  const format = (textToValidate: string) : void => {
    console.log("Format");

  }

  //Copy the text to the clipboard
  const copy = (textToCopy : string) : void => {
    console.log("Copy");
  }

  //Clear the text
  const clear = (textToClear : string) : void => {
    console.log("Clear");
     
  }

  return (
        <Grid2 xs={1} lg={1} rowSpacing={2}>
            <Grid2>
              <button onClick={()=> format(props.textToManage) }>Format</button>
            </Grid2>
            <Grid2>
              <button onClick={()=> copy(props.textToManage) }>Copy</button>
            </Grid2>
            <Grid2 >
              <button onClick={()=> clear(props.textToManage) }>Clear</button>
            </Grid2>
        </Grid2>
  );
}
