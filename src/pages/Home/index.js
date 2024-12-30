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

const containerStyle = {
  maxHeight: "70vh",
  minHeight: "50vh",
  minWidth: "50vw",
  maxWidth: "65vw",
  display: "flex",
};

const textAreaStyle = {
  // marginTop: "50px",
  width: "100%",
  height: "100%",
  // maxHeight: "70vh",
  // maxWidth: "65vw",
  // minHeight: "50vh",
  // minWidth: "50vw",
};

function Presentation() {

  const [text, setText] = React.useState("");

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
                onChange={(text) => {
                  setText(text);
                }}
              ></TextareaAutosize>
            </Grid2>
            <FormatterAction textToManage={text} setTextToManage={setText} />
          </Grid2>
        </Container>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
