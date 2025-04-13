import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Card, CardContent, Grid, Chip, Divider, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from '../../api/axios';

const VerifyTickets = () => {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [alertMessage, setAlertMessage] = useState({ message: '', severity: 'success' });
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchTodayBookings = async () => {
      try {
        const response = await axios.get('/Booking');
        
        // Get today's date in the format your API uses
        const today = new Date().toISOString().split('T')[0];
        
        // Filter for today's confirmed bookings
        const todaysConfirmedBookings = response.data.filter(
          booking => booking.date === today && booking.status === 'confirmed'
        );
        
        setTodayBookings(todaysConfirmedBookings);
      } catch (error) {
        console.error('Error fetching today\'s bookings:', error);
        showAlert('Failed to load today\'s bookings', 'error');
      } finally {
        setInitialLoad(false);
      }
    };

    fetchTodayBookings();
  }, []);

  const handleSearch = async () => {
    if (!bookingId.trim()) {
      showAlert('Please enter a booking ID', 'warning');
      return;
    }
    
    setLoading(true);
    try {
      // First try to find booking in local state (today's bookings)
      const localBooking = todayBookings.find(
        b => b.bookingID === bookingId || b._id === bookingId
      );
      
      if (localBooking) {
        setBooking(localBooking);
      } else {
        // If not found locally, fetch from API
        const response = await axios.get(`/Booking/${bookingId}`);
        setBooking(response.data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      showAlert('Booking not found or invalid ID', 'error');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      await axios.put(`/Booking/${booking._id}`, { status: 'verified' });
      
      // Update local state
      setBooking({ ...booking, status: 'verified' });
      setTodayBookings(prevBookings => 
        prevBookings.map(b => 
          b._id === booking._id ? { ...b, status: 'verified' } : b
        )
      );
      
      showAlert('Ticket verified successfully', 'success');
    } catch (error) {
      console.error('Error verifying ticket:', error);
      showAlert('Failed to verify ticket', 'error');
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage({ message, severity });
    setAlertOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'warning';
      case 'verified': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Verify Tickets
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Scan or Enter Booking ID
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="Enter booking ID or scan QR code"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Verify'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Booking Details */}
      {booking && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ticket Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Booking ID: {booking.bookingID}
              </Typography>
              <Typography variant="body1">
                Bus: {booking.busID}
              </Typography>
              <Typography variant="body1">
                Date: {booking.date}
              </Typography>
              <Typography variant="body1">
                Time: {booking.time}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Passenger ID: {booking.passengerID}
              </Typography>
              <Typography variant="body1">
                Seats: {booking.seats}
              </Typography>
              <Typography variant="body1">
                Amount Paid: ₹{booking.price}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={booking.status} 
                  color={getStatusColor(booking.status)} 
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {booking.status === 'confirmed' && (
              <Button 
                variant="contained" 
                color="success" 
                size="large"
                onClick={handleVerify}
              >
                Verify Ticket
              </Button>
            )}
            {booking.status === 'verified' && (
              <Typography variant="h6" color="success.main">
                Ticket Already Verified
              </Typography>
            )}
            {booking.status === 'cancelled' && (
              <Typography variant="h6" color="error">
                This ticket has been cancelled
              </Typography>
            )}
          </Box>
        </Paper>
      )}
      
      {/* Today's Bookings */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Today's Bookings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {initialLoad ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : todayBookings.length === 0 ? (
          <Typography align="center" sx={{ py: 2 }}>
            No bookings found for today
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {todayBookings.map((booking) => (
              <Grid item xs={12} md={6} key={booking._id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">
                      Booking ID: {booking.bookingID}
                    </Typography>
                    <Typography variant="body2">
                      Time: {booking.time} | Seats: {booking.seats}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={booking.status} 
                        color={getStatusColor(booking.status)} 
                        size="small"
                      />
                      <Button 
                        size="small"
                        onClick={() => {
                          setBookingId(booking.bookingID);
                          setBooking(booking);
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertMessage.severity}
        >
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VerifyTickets;
