import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import CustomWhatsAppIcon from './CustomWhatsAppIcon'; // Import the custom WhatsApp icon
import './Dashboard.css'; // Import the CSS file for styling
import PowerIcon from '@mui/icons-material/Power';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

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

  // Function to handle missing values
  const handleMissingValue = (value) => {
    return value !== '' && value !== null && value !== undefined ? value : '--';
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="container">
      {/* Header section containing logo, title, and sign-out button */}
      <Box className="header">
        {/* <img src="atria-logo.png" alt="Atria Power" className="logo" /> */} {/*Logo on top left corner */}
        <Typography variant="h4" component="h1" className="header-title">
          ATRIA UNIVERSITY-ARPL-2024-24-ABP-01
        </Typography>
        <button className="signout-button">Sign Out</button>
      </Box>

      {/* Grid container for displaying the metrics */}
      <Grid container spacing={3} className="metrics-container">
        {[
          { label: "Current PV Power", value: handleMissingValue(dashboardData.currentPvPower) + " kW", icon: <PowerIcon className="metric-icon" /> },
          { label: "Current AC Output", value: handleMissingValue(dashboardData.currentAcOutput) + " kW", icon: <PowerIcon className="metric-icon" /> },
          { label: "Total Operation Time", value: handleMissingValue(dashboardData.totalOperationTime) + " hrs", icon: <AccessTimeIcon className="metric-icon" /> },
          { label: "Inverter Temperature", value: handleMissingValue(dashboardData.inverterTemperature) + " °C", icon: <ThermostatIcon className="metric-icon" /> },
          { label: "Production Today", value: handleMissingValue(dashboardData.productionToday) + " kWh", icon: <WbSunnyIcon className="metric-icon" /> },
          { label: "Production - This Month", value: handleMissingValue(dashboardData.productionThisMonth) + " kWh", icon: <WbSunnyIcon className="metric-icon" /> },
          { label: "Production - This Year", value: handleMissingValue(dashboardData.productionThisYear) + " kWh", icon: <WbSunnyIcon className="metric-icon" /> },
          { label: "Lifetime Production", value: handleMissingValue(dashboardData.lifetimeProduction) + " kWh", icon: <WbSunnyIcon className="metric-icon" /> }, 
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper className="metric-box">
              {metric.icon}
              <Typography variant="h6">{metric.value}</Typography>
              <Typography variant="body1">{metric.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Flex container for displaying performance and general information */}
      <Box className="info-section">
        <Paper className="info-box">
          <Typography variant="h6">Performance Metrics</Typography>
          <Typography variant="body2">Last updated: {handleMissingValue(dashboardData.lastUpdated)}</Typography>
          <Typography variant="body1" className="info-label">PV Voltage(V): {handleMissingValue(dashboardData.pvVoltage)}</Typography>
          <Typography variant="body1" className="info-label">PV Current(A): {handleMissingValue(dashboardData.pvCurrent)}</Typography>
          <Typography variant="body1" className="info-label">PV Power(kW): {handleMissingValue(dashboardData.pvPower)}</Typography>
          <Typography variant="body1" className="info-label">AC Voltage(V): {handleMissingValue(dashboardData.acVoltage)}</Typography>
          <Typography variant="body1" className="info-label">AC Current(A): {handleMissingValue(dashboardData.acCurrent)}</Typography>
          <Typography variant="body1" className="info-label">AC Power(kW): {handleMissingValue(dashboardData.acPower)}</Typography>
        </Paper>

        {/* General Information */}
        <Paper className="info-box">
          <Typography variant="h6">General Information</Typography>
          <Typography variant="body2">Last updated: {handleMissingValue(dashboardData.lastUpdated)}</Typography>
          <Typography variant="body1" className="info-label">Plant type: {handleMissingValue(dashboardData.plantType)}</Typography>
          <Typography variant="body1" className="info-label">On-Grid Date: {handleMissingValue(dashboardData.onGridDate)}</Typography>
          <Typography variant="body1" className="info-label">Total Installed Capacity: {handleMissingValue(dashboardData.totalInstalledCapacity)}</Typography>
          <Typography variant="body1" className="info-label">Address: {handleMissingValue(dashboardData.address)}</Typography>
          <Typography variant="body1" className="info-label">Device Status: {handleMissingValue(dashboardData.deviceStatus)}</Typography>
          <Typography variant="body1" className="info-label">Device Name: {handleMissingValue(dashboardData.deviceName)}</Typography>
          <Typography variant="body1" className="info-label">Serial Number: {handleMissingValue(dashboardData.serialNumber)}</Typography>
          <Typography variant="body1" className="info-label">Device Type: {handleMissingValue(dashboardData.deviceType)}</Typography>
          <Typography variant="body1" className="info-label">Rated Power: {handleMissingValue(dashboardData.ratedPower)}</Typography>
          <Typography variant="body1" className="info-label">Communication Mode: {handleMissingValue(dashboardData.communicationMode)}</Typography>
        </Paper>
      </Box>

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
