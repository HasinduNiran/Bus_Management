import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const ConductorDashboard = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching conductor's ticket data
    // In a real app, this would fetch from a ticket verification endpoint
    setLoading(false);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.firstName || 'Conductor'}!
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
              Ticket Verification
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/conductor/verify-tickets"
              sx={{ mt: 1 }}
            >
              Verify Tickets
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
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h5" gutterBottom>
              Today's Status
            </Typography>
            <Typography component="p" variant="h6">
              On Duty
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ConductorDashboard;
