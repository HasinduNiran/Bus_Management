import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const DriverDashboard = () => {
  const { currentUser } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching driver's schedule
    // In a real app, this would fetch from a schedule endpoint
    setLoading(false);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.firstName || 'Driver'}!
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h5" gutterBottom>
              Today's Schedule
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/driver/schedule"
              sx={{ mt: 1 }}
            >
              View Schedule
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h5" gutterBottom>
              Driver Status
            </Typography>
            <Typography component="p" variant="h6">
              Active
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DriverDashboard;
