import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PowerIcon from '@mui/icons-material/Power';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
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
    productionToday: '',
    productionThisMonth: '',
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

  // State to handle loading state
  const [loading, setLoading] = useState(true);

  // State to handle share popup visibility
  const [sharePopupOpen, setSharePopupOpen] = useState(false);

  // State to store referral link and code
  const [referralData, setReferralData] = useState({
    referralLink: '',
    referralCode: ''
  });

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

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/referral');
        setReferralData(response.data);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };

    fetchReferralData();
  }, []);

  // Function to handle missing values
  const handleMissingValue = (value) => {
    return value !== '' && value !== null && value !== undefined ? value : '--';
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to open share popup
  const handleShareClick = () => {
    setSharePopupOpen(true);
  };

  // Function to close share popup
  const handleShareClose = () => {
    setSharePopupOpen(false);
  };

  // Function to share referral message on WhatsApp
  const shareReferral = () => {
    const message = encodeURIComponent(`${referralData.referralLink}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Container className="container">
      {/* Header section containing logo, title, and share button */}
      <Box className="header">
        <Typography variant="h4" component="h1" className="header-title">
          ATRIA UNIVERSITY-ARPL-2024-24-ABP-01
        </Typography>
        <Button variant="contained" color="primary" className="share-button" onClick={handleShareClick}>
          Share
        </Button>
        <button className="signout-button">Sign Out</button>
      </Box>

      {/* Grid container for displaying the metrics */}
      <Grid container spacing={3} className="metrics-container">
        {[
          { label: "Current PV Power", value: handleMissingValue(dashboardData.currentPvPower) + " kW", icon: <PowerIcon className="metric-icon" /> },
          { label: "Production Today", value: handleMissingValue(dashboardData.productionToday) + " kWh", icon: <WbSunnyIcon className="metric-icon" /> },
          { label: "Production - This Month", value: handleMissingValue(dashboardData.productionThisMonth) + " kWh", icon: <WbSunnyIcon className="metric-icon" /> },
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

        {/* Electricity Statistics Data */}
        <Paper className="info-box">
          <Typography variant="h6">Electricity Statistics Data</Typography>
          <Typography variant="body2">Last updated: {handleMissingValue(dashboardData.lastUpdated)}</Typography>
          <Typography variant="body1" className="info-label">PV Generation: {handleMissingValue(dashboardData.pvGeneration)} kWh</Typography>
          <Typography variant="body1" className="info-label">Self Consumption: {handleMissingValue(dashboardData.selfConsumption)} kWh</Typography>
          <Typography variant="body1" className="info-label">Self Consumption Ratio: {handleMissingValue(dashboardData.selfConsumptionRatio)} %</Typography>
        </Paper>
      </Box>

      {/* Share Popup */}
      <Dialog open={sharePopupOpen} onClose={handleShareClose}>
        <DialogTitle>Invite friends. Get free Plus.</DialogTitle>
        <DialogContent>
          <Typography>Get one week of free Duolingo Plus for every friend who joins via your invite link.</Typography>
          <Typography>Referral Link: {referralData.referralLink}</Typography>
          <Typography>Referral Code: {referralData.referralCode}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={shareReferral} color="primary">Share on WhatsApp</Button>
          <Button onClick={handleShareClose} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* WhatsApp Chat Icon */}
      <a
        href="https://wa.me/+918904967001" // Replace with the actual WhatsApp number
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="flat-whatsapp-icon.png" alt="WhatsApp" className="whatsapp-icon" />
      </a>
    </Container>
  );
};

export default Dashboard;
