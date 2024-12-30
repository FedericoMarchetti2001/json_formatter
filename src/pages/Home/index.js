/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2";
import { TextareaAutosize } from "@mui/material";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Custom components
import FormatterAction from "./components/FormatterActions";

//Other components
import { ToastContainer, cssTransition, toast } from "react-toastify";

const containerStyle = {
  maxHeight: "70vh",
  minHeight: "50vh",
  minWidth: "50vw",
  maxWidth: "65vw",
  display: "flex",
};

const textAreaStyle = {
  width: "100%",
  height: "100%",
};

function Presentation() {

  const [text, setText] = React.useState("");
  const [isValid, setIsValid] = React.useState(undefined);
  const [genericError, setGenericError] = React.useState("");

  React.useEffect(() => {
    if (isValid === true) {
      toast.success("JSON is valid");
    }
    else if(isValid === false){
      toast.error("JSON is not valid");
    }
    //isValid === undefined should do nothing
  }, [isValid]);

  React.useEffect(() => {
    if (genericError !== "") {
      toast.error(genericError);
    }
  }, [genericError]);

  return (
    <>
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
          label: "free download",
          color: "info",
        }}
        sticky
      />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container style={containerStyle}>
          <Grid2 container xs={12} lg={7} justifyContent="center" mx="auto" style={{ flex: 1 }}>
            <Grid2 item xs={12} style={{ flex: 1 }}>
              <TextareaAutosize
                placeholder="Paste your JSON here"
                minRows={10}
                maxRows={20}
                style={textAreaStyle}
                value={text}
                onChange={(textObject) => {
                  setText(textObject.target.value);
                  setIsValid(undefined);
                }}
              ></TextareaAutosize>
            </Grid2>
            <FormatterAction
              textToManage={text}
              setTextToManage={setText}
              isValid={isValid}
              setIsValid={setIsValid}
              setGenericError={setGenericError}
            />
          </Grid2>
        </Container>
      </MKBox>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
