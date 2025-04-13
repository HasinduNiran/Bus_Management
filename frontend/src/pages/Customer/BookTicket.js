import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Grid, TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, Snackbar, Alert, Box, Stepper, Step,
  StepLabel, Card, CardContent, Divider, Chip, IconButton, Avatar,
  List, ListItem, ListItemText, ListItemAvatar, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  DirectionsBus, LocationOn, EventSeat, AccessTime, 
  Payment, ShoppingCart, Check, AcUnit, Wifi, PowerSettingsNew, 
  Restaurant, LiveTv, Weekend, ArrowForward 
} from '@mui/icons-material';
import axios from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

const BookTicket = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Form data for each step
  const [routeData, setRouteData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  
  const [busData, setBusData] = useState({
    busID: '',
    busNo: '',
    seats: [],
    price: 0,
    features: []
  });
  
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const steps = ['Select Route', 'Choose Bus & Seats', 'Payment'];
  
  // Mock seat data - in a real app, this would come from the backend
  const totalSeats = 40;
  const [availableSeats, setAvailableSeats] = useState(Array.from({ length: totalSeats }, (_, i) => ({ 
    id: i + 1, 
    available: Math.random() > 0.3 // Randomly mark some seats as unavailable
  })));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch buses
        const busesResponse = await axios.get('/Bus');
        setBuses(busesResponse.data);
        
        // Mock routes data - in a real app, fetch from backend
        setRoutes([
          { _id: 'route1', from: 'Colombo', to: 'Kandy', distance: 115, price: 500 },
          { _id: 'route2', from: 'Colombo', to: 'Galle', distance: 120, price: 450 },
          { _id: 'route3', from: 'Colombo', to: 'Jaffna', distance: 400, price: 1200 },
          { _id: 'route4', from: 'Kandy', to: 'Colombo', distance: 115, price: 500 },
          { _id: 'route5', from: 'Galle', to: 'Colombo', distance: 120, price: 450 },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load available buses and routes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRouteDataChange = (e) => {
    const { name, value } = e.target;
    setRouteData({
      ...routeData,
      [name]: value
    });
  };

  const handleBusSelection = (bus) => {
    setBusData({
      ...busData,
      busID: bus._id,
      busNo: bus.busNo,
      features: bus.features || [],
      price: calculatePrice()
    });
  };

  const handleSeatToggle = (seatId) => {
    const seat = availableSeats.find(s => s.id === seatId);
    if (!seat.available) return;
    
    const isSelected = busData.seats.includes(seatId);
    
    if (isSelected) {
      setBusData({
        ...busData,
        seats: busData.seats.filter(id => id !== seatId)
      });
    } else {
      if (busData.seats.length < routeData.passengers) {
        setBusData({
          ...busData,
          seats: [...busData.seats, seatId]
        });
      } else {
        setErrorMessage(`You can only select ${routeData.passengers} seat(s)`);
      }
    }
  };

  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const calculatePrice = () => {
    const selectedRoute = routes.find(
      r => r.from === routeData.from && r.to === routeData.to
    );
    
    return selectedRoute ? selectedRoute.price * routeData.passengers : 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate route selection
      if (!routeData.from || !routeData.to || !routeData.date) {
        setErrorMessage('Please fill in all required fields');
        return;
      }
      
      if (routeData.from === routeData.to) {
        setErrorMessage('Departure and destination cannot be the same');
        return;
      }
    }
    
    if (activeStep === 1) {
      // Validate bus and seat selection
      if (!busData.busID) {
        setErrorMessage('Please select a bus');
        return;
      }
      
      if (busData.seats.length < routeData.passengers) {
        setErrorMessage(`Please select ${routeData.passengers} seat(s)`);
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Prepare booking data
      const bookingData = {
        passengerID: currentUser?._id,
        busID: busData.busID,
        routeID: routes.find(r => r.from === routeData.from && r.to === routeData.to)?._id,
        date: routeData.date,
        time: '08:00', // Mock time - in a real app, this would be selected
        seats: routeData.passengers,
        seatNumbers: busData.seats,
        price: busData.price,
        status: 'confirmed',
        paymentMethod: paymentData.method,
        from: routeData.from,
        to: routeData.to
      };
      
      const response = await axios.post('/Booking', bookingData);
      setSuccessMessage('Ticket booked successfully!');
      
      // Redirect to bookings page after short delay
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 2000);
    } catch (error) {
      console.error('Error booking ticket:', error);
      setErrorMessage('Failed to book ticket. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Route Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>From</InputLabel>
                  <Select
                    name="from"
                    value={routeData.from}
                    onChange={handleRouteDataChange}
                    label="From"
                  >
                    {Array.from(new Set(routes.map(route => route.from))).map(city => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>To</InputLabel>
                  <Select
                    name="to"
                    value={routeData.to}
                    onChange={handleRouteDataChange}
                    label="To"
                  >
                    {Array.from(new Set(routes.map(route => route.to))).map(city => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Journey Date"
                  type="date"
                  name="date"
                  value={routeData.date}
                  onChange={handleRouteDataChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Passengers"
                  type="number"
                  name="passengers"
                  value={routeData.passengers}
                  onChange={handleRouteDataChange}
                  required
                  fullWidth
                  InputProps={{ inputProps: { min: 1, max: 5 } }}
                />
              </Grid>
            </Grid>
            
            {routeData.from && routeData.to && (
              <Box sx={{ mt: 4, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Route Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {routeData.from} to {routeData.to}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      Distance: {routes.find(r => r.from === routeData.from && r.to === routeData.to)?.distance || '0'} km
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Bus and Seats
            </Typography>
            
            {/* Bus Selection */}
            <Typography variant="subtitle1" gutterBottom>
              Available Buses
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {buses
                .filter(bus => bus.status === 'Active' || !bus.status)
                .map(bus => (
                <Grid item xs={12} sm={6} md={4} key={bus._id}>
                  <Card 
                    variant={busData.busID === bus._id ? 'elevation' : 'outlined'}
                    elevation={busData.busID === bus._id ? 4 : 1}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: busData.busID === bus._id ? 'primary.light' : 'background.paper',
                      color: busData.busID === bus._id ? 'white' : 'text.primary'
                    }}
                    onClick={() => handleBusSelection(bus)}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {bus.busNo}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color={busData.busID === bus._id ? 'white' : 'text.secondary'}>
                        {bus.type || 'Regular'} Bus
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventSeat fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {bus.busSeat} Seats
                        </Typography>
                      </Box>
                      {bus.features && bus.features.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {bus.features.map(feature => (
                            <Chip 
                              key={feature} 
                              label={feature} 
                              size="small"
                              sx={{ 
                                mr: 0.5, 
                                mb: 0.5,
                                bgcolor: busData.busID === bus._id ? 'primary.dark' : 'default'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1">
                          ₹{calculatePrice()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Seat Selection */}
            {busData.busID && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Select Your Seats ({busData.seats.length}/{routeData.passengers})
                </Typography>
                <Paper sx={{ p: 3, mb: 2 }}>
                  {/* Bus layout */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Front of Bus
                    </Typography>
                    <Divider />
                  </Box>
                  
                  <Grid container spacing={1} justifyContent="center">
                    {availableSeats.map((seat) => (
                      <Grid item key={seat.id}>
                        <Button
                          variant={busData.seats.includes(seat.id) ? "contained" : "outlined"}
                          color={busData.seats.includes(seat.id) ? "primary" : seat.available ? "primary" : "error"}
                          disabled={!seat.available}
                          onClick={() => handleSeatToggle(seat.id)}
                          sx={{ 
                            minWidth: 40, 
                            height: 40, 
                            m: 0.5,
                            opacity: seat.available ? 1 : 0.5
                          }}
                        >
                          {seat.id}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                      <Button variant="contained" size="small" sx={{ minWidth: 30, height: 30, mr: 1 }} />
                      <Typography variant="body2">Selected</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                      <Button variant="outlined" size="small" sx={{ minWidth: 30, height: 30, mr: 1 }} />
                      <Typography variant="body2">Available</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="outlined" color="error" size="small" sx={{ minWidth: 30, height: 30, mr: 1, opacity: 0.5 }} disabled />
                      <Typography variant="body2">Booked</Typography>
                    </Box>
                  </Box>
                </Paper>
                
                {/* Features */}
                {busData.features && busData.features.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Bus Features
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        {busData.features.includes('AC') && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AcUnit color="primary" />
                              <Typography variant="body2" sx={{ ml: 1 }}>Air Conditioning</Typography>
                            </Box>
                          </Grid>
                        )}
                        {busData.features.includes('WiFi') && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Wifi color="primary" />
                              <Typography variant="body2" sx={{ ml: 1 }}>WiFi</Typography>
                            </Box>
                          </Grid>
                        )}
                        {busData.features.includes('USB Charging') && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PowerSettingsNew color="primary" />
                              <Typography variant="body2" sx={{ ml: 1 }}>USB Charging</Typography>
                            </Box>
                          </Grid>
                        )}
                        {busData.features.includes('Snacks') && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Restaurant color="primary" />
                              <Typography variant="body2" sx={{ ml: 1 }}>Snacks</Typography>
                            </Box>
                          </Grid>
                        )}
                        {busData.features.includes('Entertainment System') && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LiveTv color="primary" />
                              <Typography variant="body2" sx={{ ml: 1 }}>Entertainment</Typography>
                            </Box>
                          </Grid>
                        )}
                        {busData.features.includes('Reclining Seats') && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Weekend color="primary" />
                              <Typography variant="body2" sx={{ ml: 1 }}>Reclining Seats</Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            
            {/* Booking Summary */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Booking Summary
              </Typography>
              <List disablePadding>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <DirectionsBus />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Bus" 
                    secondary={busData.busNo} 
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <LocationOn />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Route" 
                    secondary={`${routeData.from} to ${routeData.to}`} 
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Date & Time" 
                    secondary={`${routeData.date} at 08:00 AM`} 
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <EventSeat />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Seats" 
                    secondary={`${routeData.passengers} seat(s): ${busData.seats.join(', ')}`} 
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1">
                        Total Amount
                      </Typography>
                    } 
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    ₹{busData.price}
                  </Typography>
                </ListItem>
              </List>
            </Paper>
            
            {/* Payment Options */}
            <Typography variant="subtitle1" gutterBottom>
              Select Payment Method
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Card 
                  variant={paymentData.method === 'card' ? 'elevation' : 'outlined'}
                  elevation={paymentData.method === 'card' ? 3 : 1}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: paymentData.method === 'card' ? 'primary.light' : 'background.paper',
                    color: paymentData.method === 'card' ? 'white' : 'text.primary'
                  }}
                  onClick={() => setPaymentData({...paymentData, method: 'card'})}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Payment fontSize="large" />
                      <Typography variant="h6" sx={{ ml: 2 }}>
                        Credit/Debit Card
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card 
                  variant={paymentData.method === 'upi' ? 'elevation' : 'outlined'}
                  elevation={paymentData.method === 'upi' ? 3 : 1}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: paymentData.method === 'upi' ? 'primary.light' : 'background.paper',
                    color: paymentData.method === 'upi' ? 'white' : 'text.primary'
                  }}
                  onClick={() => setPaymentData({...paymentData, method: 'upi'})}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ShoppingCart fontSize="large" />
                      <Typography variant="h6" sx={{ ml: 2 }}>
                        UPI / Wallet
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Card Details Form - Show only if card payment selected */}
            {paymentData.method === 'card' && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Enter Card Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Card Number"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentDataChange}
                      fullWidth
                      placeholder="1234 5678 9012 3456"
                      inputProps={{ maxLength: 19 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Cardholder Name"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentDataChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Expiry Date"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentDataChange}
                      placeholder="MM/YY"
                      fullWidth
                      inputProps={{ maxLength: 5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CVV"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentDataChange}
                      fullWidth
                      type="password"
                      inputProps={{ maxLength: 3 }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            {/* UPI Details - Show only if UPI payment selected */}
            {paymentData.method === 'upi' && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  UPI Payment
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  You will be redirected to your UPI app to complete the payment.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" 
                    alt="UPI" 
                    style={{ height: 60 }}
                  />
                </Box>
              </Paper>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Book Your Ticket
        </Typography>
        
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {activeStep === steps.length ? (
            // Final confirmation
            <Box sx={{ textAlign: 'center' }}>
              <Check sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Thank you for your booking!
              </Typography>
              <Typography variant="subtitle1">
                Your booking has been confirmed. You will receive an email confirmation shortly.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/customer/bookings')}
                sx={{ mt: 3 }}
              >
                View My Bookings
              </Button>
            </Box>
          ) : (
            // Step content
            <Box>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookTicket;
