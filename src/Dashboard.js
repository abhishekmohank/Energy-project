import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import './Dashboard.css';

const Dashboard = () => {
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
    pvGeneration: '',
    selfConsumption: '',
    selfConsumptionRatio: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      const phoneNumber = localStorage.getItem('phone_number'); // Store phone number in localStorage during login
      const response = await axios.get('http://localhost:5001/api/dashboard', {
        headers: {
          'Authorization': sessionToken,
          'Phone-Number': phoneNumber
        }
      });
      const data = response.data;

      if (response.status === 401) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setDashboardData({
        pvVoltage: data.Vpv1,
        pvCurrent: data.Ipv1,
        pvPower: data.Pac,
        acVoltage: data.Vgrid_PhaseA,
        acCurrent: data.Igrid_PhaseA,
        acPower: data.Pac,
        currentPvPower: data.Pac,
        currentAcOutput: data.PmeterTotal,
        totalOperationTime: data.TimeTotal,
        inverterTemperature: data.Temperature1,
        productionToday: data.Eday,
        productionThisMonth: data.productionThisMonth, // Updated field
        productionThisYear: 'N/A',
        lifetimeProduction: data.Etotal,
        plantType: data.ModelType,
        onGridDate: 'N/A',
        totalInstalledCapacity: 'N/A',
        address: 'N/A',
        deviceStatus: data.WorkStatus,
        deviceName: 'N/A',
        serialNumber: data.INV_SN,
        deviceType: data.ModelType,
        ratedPower: 'N/A',
        communicationMode: 'N/A',
        lastUpdated: data.CreationDate,
        pvGeneration: data.pvGeneration,
        selfConsumption: data.selfConsumption,
        selfConsumptionRatio: data.selfConsumptionRatio,
      });

      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Your number is not linked to any device. Please try another number.');
      } else if (error.response && error.response.status === 401) {
        setError(error.response.data.error);
      } else {
        console.error('Error fetching dashboard data:', error.message);
        setError('Error fetching dashboard data');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Reduced frequency
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSignOut = () => {
    // Clear session data
    localStorage.removeItem('session_token');
    localStorage.removeItem('phone_number');
    // Redirect to login page
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="error-container">
        <Paper className="error-message" elevation={3}>
          <ErrorOutlineIcon color="error" style={{ fontSize: 60 }} />
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1">
            {error === 'Your session has timed out. Please log in again.' ? 'Your session has expired. Please log in again to continue.' : 'Please verify your phone number before accessing the dashboard.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = '/'}
            style={{ marginTop: '20px' }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className="container">
      <Box className="header">
        <img src="logo.png" alt="Atria Power" className="logo" />
        <Typography variant="h4" component="h1" className="header-title">
          ATRIA UNIVERSITY-ARPL-2024-24-ABP-01
        </Typography>
        <Button variant="contained" className="signout-button" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Box>

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

        <Grid item xs={12} sm={6}>
          <Paper className="info-box">
            <Typography variant="h6">Electricity Statistics Data</Typography>
            <Typography variant="body2">Last updated: {dashboardData.lastUpdated}</Typography>
            <Typography variant="body1">PV Generation: {dashboardData.pvGeneration} kWh</Typography>
            <Typography variant="body1">Self Consumption: {dashboardData.selfConsumption} kWh</Typography>
            <Typography variant="body1">Self Consumption Ratio: {dashboardData.selfConsumptionRatio} %</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
