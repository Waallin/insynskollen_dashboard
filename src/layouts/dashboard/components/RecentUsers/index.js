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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import useUsersStore from "stores/UseUsersStore";
import useDatabaseStore from "stores/useDatabaseStore";

function RecentUsers() {
  const { users } = useUsersStore();
  const { version } = useDatabaseStore();

  // Sortera användare efter registreringsdatum och ta de 5 senaste
  const recentUsers =
    users
      ?.sort(
        (a, b) => new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000)
      )
      ?.slice(0, 5) || [];

  function getPlatformIcon(platform) {
    switch (platform?.toLowerCase()) {
      case "ios":
        return "📱";
      case "android":
        return "🤖";
      default:
        return "💻";
    }
  }

  function dateConverter(timestamp) {
    if (!timestamp || !timestamp.seconds) return { text: "N/A", color: "text" };
    const newDate = new Date(timestamp.seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    const newDateOnly = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (newDateOnly.getTime() === todayOnly.getTime()) {
      return { text: "Idag", color: "success" };
    } else if (newDateOnly.getTime() === yesterdayOnly.getTime()) {
      return { text: "Igår", color: "warning" };
    } else {
      const diffTime = Math.abs(todayOnly - newDateOnly);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { text: `${diffDays} dagar sedan`, color: "text" };
    }
  }

  function isPremium(user) {
    return user?.revenueCatCustomerInfo?.activeSubscriptions?.length > 0;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Senaste användare
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <Icon sx={{ fontWeight: "bold", verticalAlign: "middle" }}>trending_up</Icon>
            &nbsp;Senaste 5 registreringar
          </MDTypography>
        </MDBox>
      </MDBox>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold" color="text">
                  Användare
                </MDTypography>
              </TableCell>
              <TableCell align="center">
                <MDTypography variant="caption" fontWeight="bold" color="text">
                  Premium
                </MDTypography>
              </TableCell>
              <TableCell align="center">
                <MDTypography variant="caption" fontWeight="bold" color="text">
                  Platform
                </MDTypography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentUsers.length > 0 ? (
              recentUsers.map((user, index) => (
                <TableRow key={user.id || index}>
                  <TableCell>
                    <MDBox display="flex" alignItems="center" lineHeight={1}>
                      <MDBox ml={2} lineHeight={1}>
                        <MDTypography display="block" variant="button" fontWeight="medium">
                          {user.email?.split("@")[0] || "Anonym användare"}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          {user.email}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </TableCell>
                  <TableCell align="center">
                    {isPremium(user) ? (
                      <MDBadge
                        badgeContent="Aktiv prenumeration"
                        color="success"
                        variant="gradient"
                        size="sm"
                      />
                    ) : (
                      <MDBadge
                        badgeContent="Ingen prenumeration"
                        color="warning"
                        variant="gradient"
                        size="sm"
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <MDBadge
                      badgeContent={user.platform || "Okänd"}
                      color={
                        !user.platform || user.platform === "Okänd"
                          ? "info"
                          : user.platform?.toLowerCase() === "ios"
                          ? "success"
                          : user.platform?.toLowerCase() === "android"
                          ? "warning"
                          : "text"
                      }
                      variant="gradient"
                      size="sm"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <MDTypography variant="body2" color="text" textAlign="center" py={2}>
                    Inga användare hittades
                  </MDTypography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default RecentUsers;
