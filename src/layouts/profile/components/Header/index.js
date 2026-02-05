/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import backgroundImage from "assets/images/bg-profile.jpeg";

// react-router components
import { useLocation } from "react-router-dom";

function Header({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const user = location.state && location.state.user ? location.state.user : null;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoints.values.sm);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayName = user && user.email ? user.email.split("@")[0] : "Användarprofil";
  const subtitleParts = [];

  if (user && user.platform) {
    subtitleParts.push(user.platform);
  }

  if (user && user.version) {
    subtitleParts.push(`v${user.version}`);
  }

  const subtitle = subtitleParts.length > 0 ? subtitleParts.join(" • ") : "Insynskollen-användare";

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.7),
              rgba(gradients.info.state, 0.7)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      >
        {/* Center displayName in background area with extra styling */}
        <MDBox
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <MDBox
            px={4}
            py={2}
            borderRadius={4}
            sx={{
              background: "rgba(0, 0, 0, 0.45)",
              boxShadow: "0px 6px 32px 0px rgba(0,0,0,0.23)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backdropFilter: "blur(2.5px)",
            }}
          >
            <MDTypography
              variant="h2"
              fontWeight="bold"
              color="white"
              sx={{
                textShadow: "0px 6px 24px rgba(0,0,0,0.35), 0px 2px 0px rgba(0,0,0,0.23)"
              }}
            >
              {displayName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
