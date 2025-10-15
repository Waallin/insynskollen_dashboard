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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import RecentUsers from "layouts/dashboard/components/RecentUsers";
import UserActivity from "layouts/dashboard/components/UserActivity";
import useUsersStore from "stores/UseUsersStore";
import useDatabaseStore from "stores/useDatabaseStore";
import { useEffect } from "react";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const { users, setUsers } = useUsersStore();
  console.log("🚀 ~ Dashboard ~ users:", users);
  const { version } = useDatabaseStore();

  // Beräkna statistik
  const usersToday =
    users?.filter((user) => {
      if (!user.createdAt?.seconds) return false;
      const userDate = new Date(user.createdAt.seconds * 1000).toDateString();
      const todayDate = new Date().toDateString();
      return userDate === todayDate;
    }) || [];

  const usersYesterday =
    users?.filter((user) => {
      if (!user.createdAt?.seconds) return false;
      const userDate = new Date(user.createdAt.seconds * 1000).toDateString();
      const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      return userDate === yesterdayDate;
    }) || [];

  const premiumUsers =
    users?.filter(
      (user) => user?.revenueCatCustomerInfo?.entitlements?.active?.premium?.isActive === true
    ) || [];
  console.log("🚀 ~ Dashboard ~ premiumUsers:", premiumUsers);
  const activeUsers =
    users?.filter((user) => {
      if (!user.lastLoggedIn?.seconds) return false;
      const lastActive = new Date(user.lastLoggedIn.seconds * 1000);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastActive > sevenDaysAgo;
    }) || [];

  const iosUsers = users?.filter((user) => user.platform?.toLowerCase() === "ios") || [];
  const androidUsers = users?.filter((user) => user.platform?.toLowerCase() === "android") || [];

  const usersWithLatestVersion = users?.filter((user) => user.version === version) || [];
  const usersWithNotifications = users?.filter((user) => user.notificationsEnabled === true) || [];

  // Nya premium-användare (premium-användare som registrerade sig idag)
  const newPremiumUsers =
    premiumUsers?.filter((user) => {
      if (!user.createdAt?.seconds) return false;
      const userDate = new Date(user.createdAt.seconds * 1000).toDateString();
      const todayDate = new Date().toDateString();
      return userDate === todayDate;
    }) || [];

  // Nya premium-användare igår
  const newPremiumUsersYesterday =
    premiumUsers?.filter((user) => {
      if (!user.createdAt?.seconds) return false;
      const userDate = new Date(user.createdAt.seconds * 1000).toDateString();
      const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      return userDate === yesterdayDate;
    }) || [];

  // Beräkna procentuell tillväxt
  const userGrowthPercentage =
    usersYesterday.length > 0
      ? Math.round(((usersToday.length - usersYesterday.length) / usersYesterday.length) * 100)
      : 0;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="people"
                title="Totala användare"
                count={users?.length || 0}
                percentage={{
                  color: userGrowthPercentage >= 0 ? "success" : "error",
                  amount: `${userGrowthPercentage > 0 ? "+" : ""}${userGrowthPercentage}%`,
                  label: "tillväxt från igår",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="trending_up"
                title="Premium-användare"
                count={premiumUsers.length}
                percentage={{
                  color: "success",
                  amount:
                    users?.length > 0 ? Math.round((premiumUsers.length / users.length) * 100) : 0,
                  label: "% av totala användare",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="online_prediction"
                title="Aktiva användare"
                count={activeUsers.length}
                percentage={{
                  color: "info",
                  amount: "senaste 7 dagar",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="smartphone"
                title="Senaste version"
                count={usersWithLatestVersion.length}
                percentage={{
                  color: usersWithLatestVersion.length === users?.length ? "success" : "warning",
                  amount:
                    users?.length > 0
                      ? Math.round((usersWithLatestVersion.length / users.length) * 100)
                      : 0,
                  label: "% har senaste version",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Plattformsfördelning"
                  description={`${iosUsers.length} iOS, ${androidUsers.length} Android`}
                  date="användare per plattform"
                  chart={{
                    labels: ["iOS", "Android", "Okänd"],
                    datasets: {
                      label: "Användare",
                      data: [
                        iosUsers.length,
                        androidUsers.length,
                        (users?.length || 0) - iosUsers.length - androidUsers.length,
                      ],
                    },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Nya användare"
                  description={
                    <>
                      <strong>{usersToday.length}</strong> nya användare idag
                    </>
                  }
                  date="registreringar"
                  chart={{
                    labels: ["6 dagar", "5 dagar", "4 dagar", "3 dagar", "2 dagar", "Igår", "Idag"],
                    datasets: {
                      label: "Nya användare",
                      data: [
                        0,
                        0,
                        0,
                        0,
                        0,
                        usersYesterday.length,
                        usersToday.length, // Du kan lägga till mer historisk data här
                      ],
                    },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="warning"
                  title="Nya premium-användare"
                  description={
                    <>
                      <strong>{newPremiumUsers.length}</strong> nya premium-användare idag
                    </>
                  }
                  date="premium registreringar"
                  chart={{
                    labels: ["6 dagar", "5 dagar", "4 dagar", "3 dagar", "2 dagar", "Igår", "Idag"],
                    datasets: {
                      label: "Nya premium-användare",
                      data: [
                        0,
                        0,
                        0,
                        0,
                        0,
                        newPremiumUsersYesterday.length,
                        newPremiumUsers.length,
                      ],
                    },
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <RecentUsers />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <UserActivity />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
