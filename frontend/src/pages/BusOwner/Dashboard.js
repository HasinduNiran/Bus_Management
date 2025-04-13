import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const BusOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const busesResponse = await axios.get('/Bus');
        setBuses(busesResponse.data);
        
        const driversResponse = await axios.get('/Driver');
        setDrivers(driversResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.firstName || 'Bus Owner'}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
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
              Total Buses
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : buses.length}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h5" gutterBottom>
              Total Drivers
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : drivers.length}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              component={Link} 
              to="/busowner/buses"
              sx={{ mt: 1 }}
            >
              Manage Buses
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BusOwnerDashboard;
