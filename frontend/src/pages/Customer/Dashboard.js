import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/Booking');
        // Filter bookings for current user
        const userBookings = response.data.filter(
          booking => booking.passengerID === currentUser._id
        );
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser._id]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser.firstName}!
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
              Total Bookings
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : bookings.length}
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
              Upcoming Trips
            </Typography>
            <Typography component="p" variant="h4">
              {loading ? '...' : bookings.filter(b => b.status === 'confirmed').length}
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
              to="/customer/book-ticket"
              sx={{ mt: 1 }}
            >
              Book New Ticket
            </Button>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Bookings
            </Typography>
            
            {loading ? (
              <Typography>Loading bookings...</Typography>
            ) : bookings.length === 0 ? (
              <Typography>No bookings found. Book your first trip now!</Typography>
            ) : (
              <Grid container spacing={2}>
                {bookings.slice(0, 3).map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Bus: {booking.busID}
                        </Typography>
                        <Typography color="text.secondary">
                          Date: {booking.date}
                        </Typography>
                        <Typography color="text.secondary">
                          Time: {booking.time}
                        </Typography>
                        <Typography color="text.secondary">
                          Seats: {booking.seats}
                        </Typography>
                        <Typography 
                          sx={{ 
                            mt: 1, 
                            color: booking.status === 'confirmed' ? 'success.main' : 'warning.main' 
                          }}
                        >
                          Status: {booking.status}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Button
              component={Link}
              to="/customer/bookings"
              sx={{ mt: 3 }}
            >
              View All Bookings
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;
