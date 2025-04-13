import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Button, Chip, CircularProgress } from '@mui/material';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const ViewBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/Booking');
        // Filter bookings for current user
        const userBookings = response.data.filter(
          booking => booking.passengerID === currentUser?._id
        );
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`/Booking/${bookingId}`, { status: 'cancelled' });
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

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
        My Bookings
      </Typography>
      
      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}
      
      {bookings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No bookings found</Typography>
          <Button variant="contained" color="primary" href="/customer/book-ticket" sx={{ mt: 2 }}>
            Book a Ticket
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Booking ID: {booking.bookingID}
                  </Typography>
                  <Typography color="text.secondary">
                    Bus: {booking.busID}
                  </Typography>
                  <Typography color="text.secondary">
                    Date: {booking.date} | Time: {booking.time}
                  </Typography>
                  <Typography color="text.secondary">
                    Seats: {booking.seats} | Price: ₹{booking.price}
                  </Typography>
                  <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Chip 
                      label={booking.status} 
                      color={getStatusColor(booking.status)} 
                    />
                    {booking.status === 'pending' && (
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ViewBookings;
