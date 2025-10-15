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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import useUsersStore from "stores/UseUsersStore";
import useDatabaseStore from "stores/useDatabaseStore";

function UserActivity() {
  const { users } = useUsersStore();
  const { version } = useDatabaseStore();

  // Användare som varit aktiva idag
  const activeToday =
    users?.filter((user) => {
      if (!user.lastLoggedIn?.seconds) return false;
      const lastActive = new Date(user.lastLoggedIn.seconds * 1000);
      const today = new Date();
      return lastActive.toDateString() === today.toDateString();
    }) || [];

  // Användare som behöver uppdatera (alla som inte har senaste versionen)
  const needsUpdate = users?.filter((user) => !user.version || user.version !== version) || [];

  // Användare utan notifikationer
  const noNotifications = users?.filter((user) => user.notificationsEnabled === false) || [];

  // Användare som inte varit aktiva på 30 dagar
  const inactiveUsers =
    users?.filter((user) => {
      if (!user.lastLoggedIn?.seconds) return true;
      const lastActive = new Date(user.lastLoggedIn.seconds * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return lastActive < thirtyDaysAgo;
    }) || [];

  const activities = [
    {
      color: "success",
      icon: "online_prediction",
      title: "Aktiva idag",
      count: activeToday.length,
      description: `användare loggade in idag (${
        users?.length > 0 ? Math.round((activeToday.length / users.length) * 100) : 0
      }%)`,
    },
    {
      color: "warning",
      icon: "system_update",
      title: "Behöver uppdatera",
      count: needsUpdate.length,
      description: `användare har gamla versioner (${
        users?.length > 0 ? Math.round((needsUpdate.length / users.length) * 100) : 0
      }%)`,
    },
    {
      color: "info",
      icon: "notifications_off",
      title: "Inga notifikationer",
      count: noNotifications.length,
      description: `användare har avaktiverat notifikationer (${
        users?.length > 0 ? Math.round((noNotifications.length / users.length) * 100) : 0
      }%)`,
    },
    {
      color: "error",
      icon: "person_off",
      title: "Inaktiva användare",
      count: inactiveUsers.length,
      description: `inte aktiva på 30+ dagar (${
        users?.length > 0 ? Math.round((inactiveUsers.length / users.length) * 100) : 0
      }%)`,
    },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Användaraktivitet
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <Icon sx={{ fontWeight: "bold", verticalAlign: "middle" }}>analytics</Icon>
            &nbsp;Översikt av användarstatus
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {activities.map((activity, index) => (
          <TimelineItem
            key={index}
            color={activity.color}
            icon={activity.icon}
            title={
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDTypography variant="button" fontWeight="medium">
                  {activity.title}
                </MDTypography>
                <MDBadge
                  badgeContent={activity.count}
                  color={activity.color}
                  variant="gradient"
                  size="sm"
                />
              </MDBox>
            }
            dateTime={
              <MDTypography variant="caption" color="text">
                {activity.description}
              </MDTypography>
            }
          />
        ))}
      </MDBox>
    </Card>
  );
}

export default UserActivity;
