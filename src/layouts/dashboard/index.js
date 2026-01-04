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

      // Exkludera användare som bara varit aktiva samma dag som kontot skapades
      const createdAt =
        user.createdAt?.seconds != null ? new Date(user.createdAt.seconds * 1000) : null;
      if (createdAt && createdAt.toDateString() === lastActive.toDateString()) {
        return false;
      }

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

  // Historik senaste 7 dagarna (totala registreringar)
  const today = new Date();
  const last7DaysLabels = [];
  const last7DaysKeys = [];

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const key = date.toDateString();
    last7DaysKeys.push(key);

    if (i === 0) {
      last7DaysLabels.push("Idag");
    } else if (i === 1) {
      last7DaysLabels.push("Igår");
    } else {
      last7DaysLabels.push(`${i} dagar`);
    }
  }

  const registrationsByDate = last7DaysKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: 0,
    }),
    {}
  );

  users?.forEach((user) => {
    if (!user.createdAt?.seconds) return;
    const dateKey = new Date(user.createdAt.seconds * 1000).toDateString();
    if (registrationsByDate[dateKey] !== undefined) {
      registrationsByDate[dateKey] += 1;
    }
  });

  const weeklyRegistrations = last7DaysKeys.map((key) => registrationsByDate[key] || 0);

  // Historik senaste 7 dagarna (aktiva användare)
  const activeByDate = last7DaysKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: 0,
    }),
    {}
  );

  users?.forEach((user) => {
    if (!user.lastLoggedIn?.seconds) return;

    const lastActiveDate = new Date(user.lastLoggedIn.seconds * 1000);
    const dateKey = lastActiveDate.toDateString();

    const createdAtDate =
      user.createdAt?.seconds != null ? new Date(user.createdAt.seconds * 1000) : null;
    // Exkludera användare som bara varit aktiva samma dag som kontot skapades
    if (createdAtDate && createdAtDate.toDateString() === dateKey) return;

    if (activeByDate[dateKey] !== undefined) {
      activeByDate[dateKey] += 1;
    }
  });

  const weeklyActiveUsers = last7DaysKeys.map((key) => activeByDate[key] || 0);

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
                title="Nya användare (idag)"
                count={usersToday.length}
                percentage={{
                  color: "success",
                  amount:
                    users?.length > 0 ? Math.round((usersToday.length / users.length) * 100) : 0,
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
                    labels: ["iOS", "Android"],
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
                    labels: last7DaysLabels,
                    datasets: {
                      label: "Nya användare",
                      data: weeklyRegistrations,
                    },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="warning"
                  title="Aktiva användare"
                  description={
                    <>
                      <strong>{weeklyActiveUsers[weeklyActiveUsers.length - 1] || 0}</strong> aktiva
                      användare idag
                    </>
                  }
                  date="aktiva användare (senaste 7 dagar)"
                  chart={{
                    labels: last7DaysLabels,
                    datasets: {
                      label: "Aktiva användare",
                      data: weeklyActiveUsers,
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
