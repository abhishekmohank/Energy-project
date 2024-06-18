import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PowerIcon from '@mui/icons-material/Power';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import './Dashboard.css';
import Logo from './logo.png'; // Import your logo
import GiftIcon from './gift-icon.png'; // Import the gift icon

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    currentPvPower: '',
    productionToday: '',
    productionThisMonth: '',
    lifetimeProduction: '',
    lastUpdated: '',
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
    pvGeneration: '',
    selfConsumption: '',
    selfConsumptionRatio: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [referralData, setReferralData] = useState({
    referralLink: '',
    referralCode: ''
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('${process.env.REACT_APP_API_URL}/api/dashboard');
      const data = response.data;

      if (response.status === 401) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setDashboardData({
        currentPvPower: data.Pac,
        productionToday: data.Eday,
        productionThisMonth: data.productionThisMonth,
        lifetimeProduction: data.Etotal,
        lastUpdated: data.CreationDate,
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
        pvGeneration: data.pvGeneration,
        selfConsumption: data.selfConsumption,
        selfConsumptionRatio: data.selfConsumptionRatio,
      });

      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Device not found. Please try another one.');
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

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await axios.get('${process.env.REACT_APP_API_URL}/api/referral');
        setReferralData(response.data);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };

    fetchReferralData();
  }, []);

  const handleSignOut = () => {
    // Redirect to login page
    window.location.href = '/';
  };

  const handleShareClick = () => {
    setSharePopupOpen(true);
  };

  const handleShareClose = () => {
    setSharePopupOpen(false);
  };

  const shareReferral = () => {
    const message = encodeURIComponent(`Join using my referral link: ${referralData.referralLink}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleMissingValue = (value) => {
    return value !== '' && value !== null && value !== undefined ? value : '--';
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
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1">
            {error === 'Your session has timed out. Please log in again.' ? 'Your session has expired. Please log in again to continue.' : 'Please verify your device before accessing the dashboard.'}
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
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
          <Typography variant="h6" className="logo-name"> </Typography>
        </div>
        <Typography variant="h4" component="h1" className="header-title">
          ATRIA UNIVERSITY-ARPL-2024-24-ABP-01
        </Typography>
        <div className="header-buttons">
          <Button variant="contained" color="primary" className="share-button" onClick={handleShareClick}>
            Refer a Friend!
          </Button>
          <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
        </div>
      </Box>

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

        <Paper className="info-box">
          <Typography variant="h6">Electricity Statistics Data</Typography>
          <Typography variant="body1" className="info-label">PV Generation: {handleMissingValue(dashboardData.pvGeneration)} kWh</Typography>
          <Typography variant="body1" className="info-label">Self Consumption: {handleMissingValue(dashboardData.selfConsumption)} kWh</Typography>
          <Typography variant="body1" className="info-label">Self Consumption Ratio: {handleMissingValue(dashboardData.selfConsumptionRatio)}%</Typography>
        </Paper>
      </Box>

      <Dialog open={sharePopupOpen} onClose={handleShareClose}>
        <DialogTitle>
          <img src={GiftIcon} alt="Gift Icon" className="popup-icon" />
          Share and Earn!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">Share your referral link to earn rewards:</Typography>
          <Typography variant="body2" className="referral-link">{referralData.referralLink}</Typography>
          <Typography variant="body2">Referral Code: {referralData.referralCode}</Typography>
          <Button variant="contained" color="primary" onClick={shareReferral} style={{ marginTop: '20px' }}>
            Share via WhatsApp
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* WhatsApp Chat Icon */}
      <a
        href={`https://wa.me/1234567890?text=${encodeURIComponent(`Join using my referral link: ${referralData.referralLink}`)}`} // Replace 1234567890 with the specific phone number
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
