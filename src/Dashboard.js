import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';

const Dashboard = () => {
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
          <Paper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Basic Info
            </Typography>
            {/* Basic info content */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Real-time Info
            </Typography>
            {/* Real-time info content */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Power / Production
            </Typography>
            {/* Power / Production content */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Typography variant="h6" gutterBottom>
              PV Side
            </Typography>
            {/* PV Side content */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Typography variant="h6" gutterBottom>
              AC Side
            </Typography>
            {/* AC Side content */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
