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

import { useState, useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// react-router components
import { useNavigate } from "react-router-dom";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

function Tables() {
  const navigate = useNavigate();
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();

  const [premiumFilter, setPremiumFilter] = useState("all");

  const filteredRows = useMemo(() => {
    if (premiumFilter === "active") {
      return rows.filter(
        (row) => row.user?.revenueCatCustomerInfo?.activeSubscriptions?.length > 0
      );
    }

    if (premiumFilter === "none") {
      return rows.filter(
        (row) => !row.user?.revenueCatCustomerInfo?.activeSubscriptions?.length
      );
    }

    return rows;
  }, [rows, premiumFilter]);

  const handleRowClick = (row) => {
    const user = row.user || row;
    if (!user) return;
    navigate("/profile", { state: { user } });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Users
                  </MDTypography>
                  <MDBox display="flex" gap={1}>
                    <MDButton
                      variant={premiumFilter === "all" ? "contained" : "outlined"}
                      color="white"
                      size="small"
                      onClick={() => setPremiumFilter("all")}
                    >
                      Alla
                    </MDButton>
                    <MDButton
                      variant={premiumFilter === "active" ? "contained" : "outlined"}
                      color="white"
                      size="small"
                      onClick={() => setPremiumFilter("active")}
                    >
                      Aktiv premium
                    </MDButton>
                    <MDButton
                      variant={premiumFilter === "none" ? "contained" : "outlined"}
                      color="white"
                      size="small"
                      onClick={() => setPremiumFilter("none")}
                    >
                      Ingen premium
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: filteredRows }}
                  isSorted={true}
                  canSearch
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  onRowClick={handleRowClick}
                />
              </MDBox>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
