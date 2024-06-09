import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard = () => {
  // State to store dashboard data
  const [dashboardData, setDashboardData] = useState({
    pvVoltage: '',
    pvCurrent: '',
    pvPower: '',
    acVoltage: '',
    acCurrent: '',
    acPower: '',
    currentPvPower: '',
    currentAcOutput: '',
    totalOperationTime: '',
    inverterTemperature: '',
    productionToday: '',
    productionThisMonth: '',
    productionThisYear: '',
    lifetimeProduction: '',
    plantType: '',
    onGridDate: '',
    totalInstalledCapacity: '',
    address: '',
    deviceStatus: '',
    deviceName: '',
    serialNumber: '',
    deviceType: '',
    ratedPower: '',
    communicationMode: '',
    lastUpdated: '',
  });

  // State to handle loading state
  const [loading, setLoading] = useState(true);

  // Fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="container">
      {/* Header section */}
      <Box className="header">
        <img src="logo.png" alt="Atria Power" className="logo" />
        <Typography variant="h4" component="h1" className="header-title">
          ATRIA UNIVERSITY-ARPL-2024-24-ABP-01
        </Typography>
        <Button variant="contained" className="signout-button">
          Sign Out
        </Button>
      </Box>

      {/* Metrics section */}
      <Grid container spacing={3} className="metrics-container">
        {[
          { label: "Current PV Power", value: dashboardData.currentPvPower + " kW" },
          { label: "Current AC Output", value: dashboardData.currentAcOutput + " kW" },
          { label: "Total Operation Time", value: dashboardData.totalOperationTime + " hrs" },
          { label: "Inverter Temperature", value: dashboardData.inverterTemperature + " °C" },
          { label: "Production Today", value: dashboardData.productionToday + " kWh" },
          { label: "Production - This Month", value: dashboardData.productionThisMonth + " kWh" },
          { label: "Production - This Year", value: dashboardData.productionThisYear + " kWh" },
          { label: "Lifetime Production", value: dashboardData.lifetimeProduction + " kWh" },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper className="metric-box">
              <Typography variant="h6">{metric.value}</Typography>
              <Typography variant="body1">{metric.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Information section */}
      <Grid container spacing={3} className="info-container">
        <Grid item xs={12} sm={6}>
          <Paper className="info-box">
            <Typography variant="h6">Performance Metrics</Typography>
            <Typography variant="body2">Last updated: {dashboardData.lastUpdated}</Typography>
            <Typography variant="body1">PV Voltage(V): {dashboardData.pvVoltage}</Typography>
            <Typography variant="body1">PV Current(A): {dashboardData.pvCurrent}</Typography>
            <Typography variant="body1">PV Power(kW): {dashboardData.pvPower}</Typography>
            <Typography variant="body1">AC Voltage(V): {dashboardData.acVoltage}</Typography>
            <Typography variant="body1">AC Current(A): {dashboardData.acCurrent}</Typography>
            <Typography variant="body1">AC Power(kW): {dashboardData.acPower}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper className="info-box">
            <Typography variant="h6">General Information</Typography>
            <Typography variant="body2">Last updated: {dashboardData.lastUpdated}</Typography>
            <Typography variant="body1">Plant type: {dashboardData.plantType}</Typography>
            <Typography variant="body1">On-Grid Date: {dashboardData.onGridDate}</Typography>
            <Typography variant="body1">Total Installed Capacity: {dashboardData.totalInstalledCapacity}</Typography>
            <Typography variant="body1">Address: {dashboardData.address}</Typography>
            <Typography variant="body1">Device Status: {dashboardData.deviceStatus}</Typography>
            <Typography variant="body1">Device Name: {dashboardData.deviceName}</Typography>
            <Typography variant="body1">Serial Number: {dashboardData.serialNumber}</Typography>
            <Typography variant="body1">Device Type: {dashboardData.deviceType}</Typography>
            <Typography variant="body1">Rated Power: {dashboardData.ratedPower}</Typography>
            <Typography variant="body1">Communication Mode: {dashboardData.communicationMode}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
