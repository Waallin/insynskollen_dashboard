/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import useDatabaseStore from "stores/useDatabaseStore";

// Images
import useUsersStore from "stores/UseUsersStore";

export default function data() {
  const { users, setUsers } = useUsersStore();
  console.log("🚀 ~ data ~ users:", users);
  const { version } = useDatabaseStore();

  const sortedUsers =
    users?.sort(
      (a, b) => new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000)
    ) || [];

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

  function getLastActiveDays(timestamp) {
    if (!timestamp || !timestamp.seconds) return { text: "Okänd", color: "text" };
    const lastActive = new Date(timestamp.seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    const lastActiveOnly = new Date(
      lastActive.getFullYear(),
      lastActive.getMonth(),
      lastActive.getDate()
    );
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (lastActiveOnly.getTime() === todayOnly.getTime()) {
      return { text: "Idag", color: "success" };
    } else if (lastActiveOnly.getTime() === yesterdayOnly.getTime()) {
      return { text: "Igår", color: "warning" };
    } else {
      const diffTime = Math.abs(todayOnly - lastActiveOnly);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { text: `${diffDays} dagar sedan`, color: "text" };
    }
  }

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

  const Author = ({ name, email, platform }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name || "Anonym användare"}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {email}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const SubscriptionInfo = ({ revenueCatCustomerInfo }) => {
    if (!revenueCatCustomerInfo?.activeSubscriptions?.length) {
      return (
        <MDBadge badgeContent="Ingen prenumeration" color="warning" variant="gradient" size="sm" />
      );
    }

    return (
      <MDBadge badgeContent="Aktiv prenumeration" color="success" variant="gradient" size="sm" />
    );
  };

  return {
    columns: [
      { Header: "Användare", accessor: "author", width: "25%", align: "left" },
      { Header: "Registrerad", accessor: "registered", width: "10%", align: "center" },
      { Header: "Senast aktiv", accessor: "lastActive", width: "10%", align: "center" },
      { Header: "Öppningar", accessor: "totalAppsOpen", width: "8%", align: "center" },
      { Header: "Premium", accessor: "subscription", width: "12%", align: "center" },
      { Header: "Version", accessor: "version", width: "8%", align: "center" },
      { Header: "Platform", accessor: "platform", width: "12%", align: "center" },
    ],

    rows: sortedUsers.map((user) => ({
      user,
      author: (
        <Author name={user.email?.split("@")[0]} email={user.email} platform={user.platform} />
      ),
      registered: (
        <MDBadge
          badgeContent={dateConverter(user.createdAt).text}
          color={dateConverter(user.createdAt).color}
          variant="gradient"
          size="sm"
        />
      ),
      subscription: <SubscriptionInfo revenueCatCustomerInfo={user.revenueCatCustomerInfo} />,
      lastActive: (
        <MDBadge
          badgeContent={getLastActiveDays(user.lastLoggedIn).text}
          color={getLastActiveDays(user.lastLoggedIn).color}
          variant="gradient"
          size="sm"
        />
      ),
      version: (
        <MDBadge
          badgeContent={user.version || "Okänd"}
          color={!user.version ? "info" : user.version === version ? "success" : "warning"}
          variant="gradient"
          size="sm"
        />
      ),
      platform: (
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
      ),
      totalAppsOpen: (
        <MDBadge
          badgeContent={user.totalAppsOpen ?? 0}
          color={user.totalAppsOpen && user.totalAppsOpen > 0 ? "success" : "warning"}
          variant="gradient"
          size="sm"
        />
      ),
    })),
  };
}
