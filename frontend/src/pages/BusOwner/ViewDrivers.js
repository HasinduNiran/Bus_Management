import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Card, CardContent, CardActions, Grid, Avatar, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from '../../api/axios';

const ViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ message: '', severity: 'success' });
  const [alertOpen, setAlertOpen] = useState(false);
  
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/Driver');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      showAlert('Failed to load drivers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage({ message, severity });
    setAlertOpen(true);
  };

  const handleOpen = (driver) => {
    setCurrentDriver(driver);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        Driver Management
      </Typography>
      
      <Grid container spacing={3}>
        {drivers.map((driver) => (
          <Grid item xs={12} sm={6} md={4} key={driver._id}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar 
                      src={driver.image || '/static/images/avatar/default.jpg'} 
                      alt={driver.firstName}
                      sx={{ width: 56, height: 56 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">
                      {driver.firstName} {driver.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Driver ID: {driver.driverID}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Phone: {driver.phone}
                </Typography>
                <Typography variant="body2">
                  Email: {driver.email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleOpen(driver)}>View Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Driver Details Dialog */}
      {currentDriver && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Driver Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                <Avatar 
                  src={currentDriver.image || '/static/images/avatar/default.jpg'} 
                  alt={currentDriver.firstName}
                  sx={{ width: 100, height: 100, margin: '0 auto' }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6">
                  {currentDriver.firstName} {currentDriver.lastName}
                </Typography>
                <Typography variant="body1">
                  Driver ID: {currentDriver.driverID}
                </Typography>
                <Typography variant="body1">
                  NIC: {currentDriver.NIC}
                </Typography>
                <Typography variant="body1">
                  Phone: {currentDriver.phone}
                </Typography>
                <Typography variant="body1">
                  Email: {currentDriver.email}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      
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

export default ViewDrivers;
