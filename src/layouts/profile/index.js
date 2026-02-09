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

// Firebase
import { database } from "../../firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

// Stores
import useUsersStore from "stores/UseUsersStore";

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

function formatAbsoluteDate(timestamp) {
  if (!timestamp || !timestamp.seconds) return "N/A";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRevenueCatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString("sv-SE");
}

function mapPeriodType(periodType) {
  if (!periodType) return "Okänd";
  switch (periodType) {
    case "TRIAL":
      return "Testperiod";
    case "INTRO":
      return "Introduktionsperiod";
    case "NORMAL":
      return "Ordinarie period";
    default:
      return periodType;
  }
}

function mapStore(store) {
  if (!store) return "Okänd";
  switch (store) {
    case "APP_STORE":
      return "App Store";
    case "MAC_APP_STORE":
      return "Mac App Store";
    case "PLAY_STORE":
      return "Google Play";
    case "AMAZON":
      return "Amazon Appstore";
    case "STRIPE":
      return "Stripe";
    default:
      return store;
  }
}

function Overview() {
  const location = useLocation();
  const initialUser = location.state && location.state.user ? location.state.user : null;
  const [user, setUser] = useState(initialUser);
  const [isEditingRegisteredDate, setIsEditingRegisteredDate] = useState(false);
  const [registeredDateInput, setRegisteredDateInput] = useState("");
  const [isSavingRegisteredDate, setIsSavingRegisteredDate] = useState(false);
  const [registeredDateError, setRegisteredDateError] = useState("");
  const { users, setUsers } = useUsersStore();

  console.log("🚀 ~ Overview ~ user:", user);

  const hasUser = Boolean(user);

  const registeredDate = hasUser ? formatAbsoluteDate(user.createdAt) : "N/A";
  const lastActiveInfo = hasUser
    ? formatRelativeDate(user.lastLoggedIn)
    : { text: "N/A", color: "text" };

  const hasActiveSubscription =
    user && user.revenueCatCustomerInfo && user.revenueCatCustomerInfo.activeSubscriptions
      ? user.revenueCatCustomerInfo.activeSubscriptions.length > 0
      : false;

  const revenueCatInfo =
    user && user.revenueCatCustomerInfo ? user.revenueCatCustomerInfo : null;

  const premiumEntitlement =
    revenueCatInfo &&
    revenueCatInfo.entitlements &&
    revenueCatInfo.entitlements.active &&
    revenueCatInfo.entitlements.active.premium
      ? revenueCatInfo.entitlements.active.premium
      : null;

  const subscriptionStatusBadge = hasActiveSubscription ? (
    <MDBadge badgeContent="Aktiv prenumeration" color="success" variant="gradient" size="sm" />
  ) : (
    <MDBadge badgeContent="Ingen prenumeration" color="warning" variant="gradient" size="sm" />
  );

  const requestDate =
    revenueCatInfo && revenueCatInfo.requestDate
      ? formatRevenueCatDate(revenueCatInfo.requestDate)
      : "N/A";

  const latestExpirationDate =
    revenueCatInfo && revenueCatInfo.latestExpirationDate
      ? formatRevenueCatDate(revenueCatInfo.latestExpirationDate)
      : "N/A";

  const planIdentifier = premiumEntitlement
    ? premiumEntitlement.productPlanIdentifier || "Okänt"
    : "Ingen aktiv plan";

  const periodTypeLabel = premiumEntitlement
    ? mapPeriodType(premiumEntitlement.periodType)
    : "Ingen aktiv period";

  const periodTypeColor = premiumEntitlement
    ? premiumEntitlement.periodType === "TRIAL"
      ? "warning"
      : premiumEntitlement.periodType === "NORMAL"
      ? "success"
      : "info"
    : "info";

  const storeLabel =
    (premiumEntitlement && mapStore(premiumEntitlement.store)) ||
    (revenueCatInfo && mapStore(revenueCatInfo.store)) ||
    "Okänd";

  const willRenewLabel =
    premiumEntitlement && typeof premiumEntitlement.willRenew === "boolean"
      ? premiumEntitlement.willRenew
        ? "Ja, förnyas automatiskt"
        : "Nej"
      : "Okänt";

  const willRenewColor =
    premiumEntitlement && typeof premiumEntitlement.willRenew === "boolean"
      ? premiumEntitlement.willRenew
        ? "success"
        : "warning"
      : "info";

  const latestPurchaseDate =
    premiumEntitlement && premiumEntitlement.latestPurchaseDate
      ? formatRevenueCatDate(premiumEntitlement.latestPurchaseDate)
      : "N/A";

  const firstSeen =
    revenueCatInfo && revenueCatInfo.firstSeen
      ? formatRevenueCatDate(revenueCatInfo.firstSeen)
      : "N/A";

  const managementUrl = revenueCatInfo && revenueCatInfo.managementURL;

  const handleStartEditRegisteredDate = () => {
    if (user && user.createdAt && user.createdAt.seconds) {
      const date = new Date(user.createdAt.seconds * 1000);
      const iso = date.toISOString();
      const [datePart, timePart] = iso.split("T");
      const timeWithoutSeconds = timePart.slice(0, 5);
      setRegisteredDateInput(`${datePart}T${timeWithoutSeconds}`);
    } else {
      setRegisteredDateInput("");
    }
    setRegisteredDateError("");
    setIsEditingRegisteredDate(true);
  };

  const handleCancelEditRegisteredDate = () => {
    setIsEditingRegisteredDate(false);
    setRegisteredDateError("");
  };

  const handleSaveRegisteredDate = async () => {
    if (!user || !user.id || !registeredDateInput) {
      setRegisteredDateError("Datum får inte vara tomt.");
      return;
    }

    try {
      setIsSavingRegisteredDate(true);
      setRegisteredDateError("");

      const newDate = new Date(registeredDateInput);
      if (Number.isNaN(newDate.getTime())) {
        setRegisteredDateError("Ogiltigt datum.");
        setIsSavingRegisteredDate(false);
        return;
      }

      const userRef = doc(database, "users", user.id);
      const newTimestamp = Timestamp.fromDate(newDate);

      await updateDoc(userRef, {
        createdAt: newTimestamp,
      });

      const updatedUser = {
        ...user,
        createdAt: newTimestamp,
      };

      setUser(updatedUser);

      if (users && Array.isArray(users)) {
        const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
        setUsers(updatedUsers);
      }

      setIsEditingRegisteredDate(false);
    } catch (error) {
      console.error("Error updating registered date:", error);
      setRegisteredDateError("Kunde inte spara datumet. Försök igen.");
    } finally {
      setIsSavingRegisteredDate(false);
    }
  };

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
                  <MDTypography variant="caption" color="text">
                    Användarens konto- och enhetsinformation.
                  </MDTypography>
                  <MDBox mt={2}>
                    <MDBox mb={1.5}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        textTransform="uppercase"
                        display="block"
                      >
                        E-post
                      </MDTypography>
                      <MDTypography variant="button" color="text" display="block">
                        {hasUser ? user.email || user.mail || "N/A" : "N/A"}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1.5}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        textTransform="uppercase"
                        display="block"
                      >
                        Plattform
                      </MDTypography>
                      <MDTypography variant="button" color="text" display="block">
                        {hasUser ? user.platform || "N/A" : "N/A"}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1.5}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        textTransform="uppercase"
                        display="block"
                      >
                        Version
                      </MDTypography>
                      <MDTypography variant="button" color="text" display="block">
                        {hasUser ? user.version || "N/A" : "N/A"}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1.5}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        textTransform="uppercase"
                        display="block"
                      >
                        Notiser
                      </MDTypography>
                      <MDBox mt={0.5}>
                        <MDBadge
                          badgeContent={
                            hasUser && user.notificationsEnabled === true ? "På" : "Av"
                          }
                          color={
                            hasUser && user.notificationsEnabled === true
                              ? "success"
                              : "warning"
                          }
                          variant="gradient"
                          size="sm"
                        />
                      </MDBox>
                    </MDBox>
                    <MDBox mb={1.5}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        textTransform="uppercase"
                        display="block"
                      >
                        Push-token
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        color="text"
                        display="block"
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          wordBreak: "break-all",
                          mt: 0.5,
                        }}
                      >
                        {hasUser && user.pushToken ? user.pushToken : "N/A"}
                      </MDTypography>
                    </MDBox>
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        textTransform="uppercase"
                        display="block"
                      >
                        Registrerad
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" flexWrap="wrap" mt={0.5}>
                        <MDTypography variant="button" color="text" display="block">
                          {registeredDate}
                        </MDTypography>
                        {hasUser && (
                          <MDTypography
                            variant="caption"
                            color="info"
                            sx={{ cursor: "pointer", ml: 1 }}
                            onClick={handleStartEditRegisteredDate}
                          >
                            Redigera
                          </MDTypography>
                        )}
                      </MDBox>
                    </MDBox>
                    {isEditingRegisteredDate && (
                      <MDBox mt={2}>
                        <MDBox display="flex" alignItems="center" mb={1}>
                          <input
                            type="datetime-local"
                            value={registeredDateInput}
                            onChange={(event) => setRegisteredDateInput(event.target.value)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #ced4da",
                              fontSize: "0.875rem",
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleSaveRegisteredDate}
                            disabled={isSavingRegisteredDate}
                            style={{
                              marginLeft: 8,
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "none",
                              backgroundColor: "#1a73e8",
                              color: "#fff",
                              fontSize: "0.75rem",
                              cursor: isSavingRegisteredDate ? "default" : "pointer",
                              opacity: isSavingRegisteredDate ? 0.7 : 1,
                            }}
                          >
                            {isSavingRegisteredDate ? "Sparar..." : "Spara"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditRegisteredDate}
                            style={{
                              marginLeft: 8,
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "none",
                              backgroundColor: "#e0e0e0",
                              color: "#333",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            Avbryt
                          </button>
                        </MDBox>
                        {registeredDateError && (
                          <MDTypography variant="caption" color="error">
                            {registeredDateError}
                          </MDTypography>
                        )}
                      </MDBox>
                    )}
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
                  <MDTypography variant="caption" color="text">
                    Översikt över användarens prenumeration baserad på RevenueCat.
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
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <MDTypography variant="button" color="text">
                        Plan
                      </MDTypography>
                      <MDBadge
                        badgeContent={planIdentifier}
                        color="info"
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
                        Periodtyp
                      </MDTypography>
                      <MDBadge
                        badgeContent={periodTypeLabel}
                        color={periodTypeColor}
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
                        Butik
                      </MDTypography>
                      <MDBadge
                        badgeContent={storeLabel}
                        color="dark"
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
                        Förnyas
                      </MDTypography>
                      <MDBadge
                        badgeContent={willRenewLabel}
                        color={willRenewColor}
                        variant="gradient"
                        size="sm"
                      />
                    </MDBox>
                    <MDBox mt={2}>
                      <MDBox mb={1.5}>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                          display="block"
                        >
                          Senaste köp
                        </MDTypography>
                        <MDTypography variant="button" color="text" display="block">
                          {latestPurchaseDate}
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={1.5}>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                          display="block"
                        >
                          Förfallodatum
                        </MDTypography>
                        <MDTypography variant="button" color="text" display="block">
                          {latestExpirationDate}
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={1.5}>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                          display="block"
                        >
                          RevenueCat senast uppdaterad
                        </MDTypography>
                        <MDTypography variant="button" color="text" display="block">
                          {requestDate}
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={managementUrl ? 1 : 0}>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                          display="block"
                        >
                          Första gången RevenueCat såg användaren
                        </MDTypography>
                        <MDTypography variant="button" color="text" display="block">
                          {firstSeen}
                        </MDTypography>
                      </MDBox>
                      {managementUrl && (
                        <MDBox mt={1.5}>
                          <MDTypography
                            variant="caption"
                            color="text"
                            fontWeight="medium"
                            textTransform="uppercase"
                            display="block"
                          >
                            Hantera prenumeration
                          </MDTypography>
                          <MDTypography variant="button" color="info" display="block">
                            <a
                              href={managementUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "inherit", textDecoration: "underline" }}
                            >
                              Öppna butikens hanteringssida
                            </a>
                          </MDTypography>
                        </MDBox>
                      )}
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
