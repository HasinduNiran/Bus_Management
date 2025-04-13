import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Chip, Divider, CircularProgress } from '@mui/material';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

// Note: In a real application, you would have a proper Schedule model and API
// This is a simplified example using bookings data to represent schedules

const ViewSchedule = () => {
  const { currentUser } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulating a schedule fetch - in a real app, you would have a proper endpoint
    const fetchSchedule = async () => {
      try {
        // Fetch bookings as a placeholder for schedule
        const response = await axios.get('/Booking');
        
        // Filter for confirmed bookings only
        const confirmedBookings = response.data.filter(
          booking => booking.status === 'confirmed'
        );
        
        // Sort by date and time
        confirmedBookings.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
        
        setSchedule(confirmedBookings);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Failed to load your schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Group schedules by date
  const scheduleByDate = schedule.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Schedule
      </Typography>
      
      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light', color: 'white' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}
      
      {Object.keys(scheduleByDate).length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No scheduled trips found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Your upcoming trips will appear here
          </Typography>
        </Paper>
      ) : (
        Object.entries(scheduleByDate).map(([date, items]) => (
          <Paper key={date} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid item xs={12} key={item._id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body1" fontWeight="bold">
                            Time: {item.time}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body1">
                            Bus: {item.busID}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body1">
                            Route: {item.routeID}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Chip 
                            label={`${item.seats} passenger(s)`} 
                            color="primary" 
                            size="small" 
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default ViewSchedule;
