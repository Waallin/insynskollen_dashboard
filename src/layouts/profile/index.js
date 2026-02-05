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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// react-router components
import { useLocation } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Overview page components
import Header from "layouts/profile/components/Header";

function formatRelativeDate(timestamp) {
  if (!timestamp || !timestamp.seconds) return { text: "N/A", color: "text" };

  const newDate = new Date(timestamp.seconds * 1000);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const newDateOnly = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  if (newDateOnly.getTime() === todayOnly.getTime()) {
    return { text: "Idag", color: "success" };
  }
  if (newDateOnly.getTime() === yesterdayOnly.getTime()) {
    return { text: "Igår", color: "warning" };
  }

  const diffTime = Math.abs(todayOnly - newDateOnly);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { text: `${diffDays} dagar sedan`, color: "text" };
}

function Overview() {
  const location = useLocation();
  const user = location.state && location.state.user ? location.state.user : null;

  const hasUser = Boolean(user);


  const registeredInfo = hasUser
    ? formatRelativeDate(user.createdAt)
    : { text: "N/A", color: "text" };
  const lastActiveInfo = hasUser
    ? formatRelativeDate(user.lastLoggedIn)
    : { text: "N/A", color: "text" };

  const hasActiveSubscription =
    user && user.revenueCatCustomerInfo && user.revenueCatCustomerInfo.activeSubscriptions
      ? user.revenueCatCustomerInfo.activeSubscriptions.length > 0
      : false;

  const subscriptionStatusBadge = hasActiveSubscription ? (
    <MDBadge badgeContent="Aktiv prenumeration" color="success" variant="gradient" size="sm" />
  ) : (
    <MDBadge badgeContent="Ingen prenumeration" color="warning" variant="gradient" size="sm" />
  );

  const requestDate =
    user && user.revenueCatCustomerInfo && user.revenueCatCustomerInfo.requestDate
      ? new Date(user.revenueCatCustomerInfo.requestDate).toLocaleString()
      : "N/A";

  const latestExpirationDate =
    user && user.revenueCatCustomerInfo && user.revenueCatCustomerInfo.latestExpirationDate
      ? user.revenueCatCustomerInfo.latestExpirationDate
      : "N/A";

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  backgroundColor: "background.paper",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Konto
                  </MDTypography>
                  <MDBox mt={2}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <MDTypography variant="button" color="text">
                        E-post
                      </MDTypography>
                      <MDTypography variant="button" color="text">
                        {hasUser ? user.email || "N/A" : "N/A"}
                      </MDTypography>
                    </MDBox>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <MDTypography variant="button" color="text">
                        Plattform
                      </MDTypography>
                      <MDTypography variant="button" color="text">
                        {hasUser ? user.platform || "N/A" : "N/A"}
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography variant="button" color="text">
                        Version
                      </MDTypography>
                      <MDTypography variant="button" color="text">
                        {hasUser ? user.version || "N/A" : "N/A"}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Aktivitet
                  </MDTypography>
                  <MDBox mt={2}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <MDTypography variant="button" color="text">
                        Registrerad
                      </MDTypography>
                      <MDBadge
                        badgeContent={registeredInfo.text}
                        color={registeredInfo.color}
                        variant="gradient"
                        size="sm"
                      />
                    </MDBox>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <MDTypography variant="button" color="text">
                        Senast aktiv
                      </MDTypography>
                      <MDBadge
                        badgeContent={lastActiveInfo.text}
                        color={lastActiveInfo.color}
                        variant="gradient"
                        size="sm"
                      />
                    </MDBox>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography variant="button" color="text">
                        Totalt antal öppningar
                      </MDTypography>
                      <MDBadge
                        badgeContent={
                          hasUser && typeof user.totalAppsOpen === "number"
                            ? user.totalAppsOpen
                            : 0
                        }
                        color={
                          hasUser && user.totalAppsOpen && user.totalAppsOpen > 0
                            ? "success"
                            : "warning"
                        }
                        variant="gradient"
                        size="sm"
                      />
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Prenumeration
                  </MDTypography>
                  <MDBox mt={2}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <MDTypography variant="button" color="text">
                        Status
                      </MDTypography>
                      {subscriptionStatusBadge}
                    </MDBox>
                    <MDBox mb={1.5}>
                      <MDTypography variant="button" color="text">
                        Senaste förnyelse / förfallodatum
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {latestExpirationDate}
                      </MDTypography>
                    </MDBox>
                    <MDBox>
                      <MDTypography variant="button" color="text">
                        Senast uppdaterad av RevenueCat
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {requestDate}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
