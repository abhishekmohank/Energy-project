import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import CustomWhatsAppIcon from './CustomWhatsAppIcon'; // Import the custom WhatsApp icon
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
        // Make an API request to get the dashboard data
        const response = await axios.get('http://localhost:5000/api/dashboard');
        // Update the state with the fetched data 
        setDashboardData(response.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="container">
      {/* Header section containing logo, title, and sign-out button */}
      <Box className="header">
        <img src="atria-logo.png" alt="Atria Power" className="logo" />
        <Typography variant="h4" component="h1" className="header-title">
          ATRIA UNIVERSITY-ARPL-2024-24-ABP-01
        </Typography>
        <Button variant="contained" className="signout-button">
          Sign Out
        </Button>
      </Box>

      {/* Grid container for displaying the metrics */}
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

      {/* Grid container for displaying performance and general information */}
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

        {/* General Information */}
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

      {/* WhatsApp Chat Icon */}
      <a
        href="https://wa.me/1234567890" // Replace with the actual WhatsApp number
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <CustomWhatsAppIcon fontSize="large" style={{ color: 'white' }} />
      </a>
    </Container>
  );
};

export default Dashboard;
