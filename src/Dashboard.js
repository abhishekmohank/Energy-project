import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import axios from 'axios'; // Assuming you use axios for backend API calls

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch dashboard data from backend
    axios.get('/api/dashboard')
      .then(response => {
        console.log('Dashboard data fetched successfully:', response.data); // Debug log
        setDashboardData(response.data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false); // Set loading to false even if there is an error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!dashboardData) {
    return <div>No data available</div>; // No data state
  }

  const { basicInfo, realTimeInfo, powerProduction, pvSide, acSide } = dashboardData;
  const currentDate = new Date().toLocaleString(); // Get current date and time

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          ATRIA UNIVERSITY-ARPL-2024-24-ABP-01 | OGS 3.3K
        </Typography>
        <Typography variant="body1">
          Last updated: {currentDate}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Basic Info
            </Typography>
            <Typography variant="body2">Device Status: {basicInfo.deviceStatus}</Typography>
            <Typography variant="body2">Device Name: {basicInfo.deviceName}</Typography>
            <Typography variant="body2">SN: {basicInfo.sn}</Typography>
            <Typography variant="body2">Check Code: {basicInfo.checkCode}</Typography>
            <Typography variant="body2">Device Model: {basicInfo.deviceModel}</Typography>
            <Typography variant="body2">Device Type: {basicInfo.deviceType}</Typography>
            <Typography variant="body2">Rated Power: {basicInfo.ratedPower} kW</Typography>
            <Typography variant="body2">Communication Mode: {basicInfo.communicationMode}</Typography>
            <Typography variant="body2">Slave Firmware Version: {basicInfo.slaveFirmwareVersion}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Real-time Info
            </Typography>
            <Typography variant="body2">Export Limit: {realTimeInfo.exportLimit}</Typography>
            <Typography variant="body2">Total Operation Time: {realTimeInfo.totalOperationTime} H</Typography>
            <Typography variant="body2">Inverter Temperature: {realTimeInfo.inverterTemperature} °C</Typography>
            <Typography variant="body2">Grid Frequency: {realTimeInfo.gridFrequency} Hz</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Power / Production
            </Typography>
            <Typography variant="body2">Current Power: {powerProduction.currentPower} W</Typography>
            <Typography variant="body2">Daily Generation: {powerProduction.dailyGeneration} kWh</Typography>
            <Typography variant="body2">Monthly Generation: {powerProduction.monthlyGeneration} kWh</Typography>
            <Typography variant="body2">Production Total: {powerProduction.productionTotal} kWh</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              PV Side
            </Typography>
            <Typography variant="body2">Voltage (V): {pvSide.voltage}</Typography>
            <Typography variant="body2">Current (A): {pvSide.current}</Typography>
            <Typography variant="body2">Power (kW): {pvSide.power}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>
              AC Side
            </Typography>
            <Typography variant="body2">Voltage (V): {acSide.voltage}</Typography>
            <Typography variant="body2">Current (A): {acSide.current}</Typography>
            <Typography variant="body2">Power (kW): {acSide.power}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
