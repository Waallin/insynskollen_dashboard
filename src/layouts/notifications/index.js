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

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Stores
import useUsersStore from "stores/UseUsersStore";

function Notifications() {
  const { users } = useUsersStore();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  // Beräkna målgrupp
  const getTargetUsers = () => {
    switch (targetAudience) {
      case "new_today":
        return (
          users?.filter((user) => {
            if (!user.createdAt?.seconds) return false;
            const createdAtDate = new Date(user.createdAt.seconds * 1000);
            const today = new Date();

            const createdAtOnly = new Date(
              createdAtDate.getFullYear(),
              createdAtDate.getMonth(),
              createdAtDate.getDate()
            );

            const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            return createdAtOnly.getTime() === todayOnly.getTime();
          }) || []
        );
      case "active":
        return (
          users?.filter((user) => {
            if (!user.lastLoggedIn?.seconds) return false;
            const lastActive = new Date(user.lastLoggedIn.seconds * 1000);
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return lastActive > sevenDaysAgo;
          }) || []
        );
      case "notifications_enabled":
        return users?.filter((user) => user.notificationsEnabled === true) || [];
      default:
        return users || [];
    }
  };

  const targetUsers = getTargetUsers();
  const usersWithPushTokens = targetUsers.filter((user) => user.pushToken);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      openErrorSB();
      return;
    }

    setIsLoading(true);

    try {
      // Här skulle du implementera din push-notifikationslogik
      // Till exempel anropa en API som skickar till Expo Push Service
      console.log("Skickar notifikation till:", usersWithPushTokens.length, "användare");
      console.log("Titel:", title);
      console.log("Meddelande:", message);
      console.log("Målgrupp:", getTargetUsers("notifications_enabled"));

      // Simulera API-anrop
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTitle("");
      setMessage("");
      openSuccessSB();
    } catch (error) {
      console.error("Fel vid skickande av notifikation:", error);
      openErrorSB();
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikation skickad"
      content={`Push-notifikation skickades till ${usersWithPushTokens.length} användare`}
      dateTime="Nu"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Fel"
      content="Kunde inte skicka notifikation. Kontrollera att titel och meddelande är ifyllda."
      dateTime="Nu"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={2}>
                  Push-notifikationer
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={3}>
                  Skicka push-notifikationer till dina användare
                </MDTypography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <MDInput
                      label="Titel"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                      placeholder="Ange titel för notifikationen"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Meddelande"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Skriv ditt meddelande här..."
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Målgrupp</InputLabel>
                      <Select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        label="Målgrupp"
                      >
                        <MenuItem value="all">Alla användare</MenuItem>
                        <MenuItem value="new_today">Nya användare (idag)</MenuItem>
                        <MenuItem value="active">Aktiva användare (7 dagar)</MenuItem>
                        <MenuItem value="notifications_enabled">
                          Användare med notifikationer aktiverade
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                      <Chip
                        label={`${targetUsers.length} användare i målgrupp`}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={`${usersWithPushTokens.length} med push-tokens`}
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={handleSendNotification}
                      disabled={isLoading || !title.trim() || !message.trim()}
                      fullWidth
                    >
                      {isLoading
                        ? "Skickar..."
                        : `Skicka till ${usersWithPushTokens.length} användare`}
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {renderSuccessSB}
      {renderErrorSB}
    </DashboardLayout>
  );
}

export default Notifications;
