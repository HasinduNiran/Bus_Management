import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, TextField, Grid, Card, CardContent, CardActions, 
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert,
  Box, Chip, Tabs, Tab, IconButton, FormControl, InputLabel, Select, MenuItem, Tooltip,
  Paper, Divider
} from '@mui/material';
import { Delete, Edit, Add, DirectionsBus, EventSeat, Route, Info } from '@mui/icons-material';
import axios from '../../api/axios';
import { useTheme } from '@mui/material/styles';

const ManageBuses = () => {
  const theme = useTheme();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ message: '', severity: 'success' });
  const [alertOpen, setAlertOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalCapacity: 0,
    routesCovered: 0
  });
  
  const [formData, setFormData] = useState({
    busNo: '',
    type: 'Regular',
    busSeat: 0,
    image: '',
    status: 'Active',
    features: []
  });

  const busTypes = ['Regular', 'Express', 'Luxury', 'Sleeper'];
  const busFeatures = ['AC', 'WiFi', 'USB Charging', 'Reclining Seats', 'Snacks', 'Entertainment System'];
  const statusOptions = ['Active', 'Maintenance', 'Out of Service'];

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/Bus');
      setBuses(response.data);
      
      // Calculate stats
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
      showAlert('Failed to load buses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      // Mock data for now - replace with actual API call when available
      setRoutes([
        { _id: 'route1', name: 'Colombo - Kandy', distance: '115km' },
        { _id: 'route2', name: 'Colombo - Galle', distance: '120km' },
        { _id: 'route3', name: 'Colombo - Jaffna', distance: '400km' }
      ]);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const calculateStats = (busData) => {
    const totalBuses = busData.length;
    const activeBuses = busData.filter(bus => bus.status === 'Active').length;
    const totalCapacity = busData.reduce((acc, bus) => acc + (bus.busSeat || 0), 0);
    
    setStats({
      totalBuses,
      activeBuses: activeBuses || totalBuses, // Fallback if status field doesn't exist yet
      totalCapacity,
      routesCovered: routes.length
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'busSeat' ? parseInt(value, 10) : value
    });
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return { ...prev, features: features.filter(f => f !== feature) };
      } else {
        return { ...prev, features: [...features, feature] };
      }
    });
  };

  const handleOpen = (bus = null) => {
    if (bus) {
      setEditMode(true);
      setCurrentBus(bus);
      setFormData({
        busNo: bus.busNo,
        type: bus.type || 'Regular',
        busSeat: bus.busSeat,
        image: bus.image || '',
        status: bus.status || 'Active',
        features: bus.features || []
      });
    } else {
      setEditMode(false);
      setCurrentBus(null);
      setFormData({
        busNo: '',
        type: 'Regular',
        busSeat: 0,
        image: '',
        status: 'Active',
        features: []
      });
    }
    setOpen(true);
  };

  const handleScheduleOpen = (bus) => {
    setCurrentBus(bus);
    // Mock schedule data - replace with actual API call
    setCurrentSchedule([
      { _id: 'sch1', route: 'Colombo - Kandy', departure: '08:00', arrival: '11:00', days: ['Monday', 'Wednesday', 'Friday'] },
      { _id: 'sch2', route: 'Kandy - Colombo', departure: '16:00', arrival: '19:00', days: ['Monday', 'Wednesday', 'Friday'] }
    ]);
    setScheduleOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleScheduleClose = () => {
    setScheduleOpen(false);
  };

  const showAlert = (message, severity) => {
    setAlertMessage({ message, severity });
    setAlertOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await axios.put(`/Bus/${currentBus._id}`, formData);
        showAlert('Bus updated successfully', 'success');
      } else {
        await axios.post('/Bus', formData);
        showAlert('Bus added successfully', 'success');
      }
      
      fetchBuses();
      handleClose();
    } catch (error) {
      console.error('Error saving bus:', error);
      showAlert(editMode ? 'Failed to update bus' : 'Failed to add bus', 'error');
    }
  };

  const handleDelete = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await axios.delete(`/Bus/${busId}`);
        showAlert('Bus deleted successfully', 'success');
        fetchBuses();
      } catch (error) {
        console.error('Error deleting bus:', error);
        showAlert('Failed to delete bus', 'error');
      }
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
        Bus Management
      </Typography>
      
      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.primary.light,
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Buses
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalBuses}
            </Typography>
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <DirectionsBus fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {stats.activeBuses} Active
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.success.light,
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Capacity
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalCapacity}
            </Typography>
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <EventSeat fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Seats available
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.info.light,
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Routes Covered
            </Typography>
            <Typography component="p" variant="h4">
              {stats.routesCovered}
            </Typography>
            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
              <Route fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Active routes
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.secondary.light,
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={() => handleOpen()}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Add New Bus
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70%' }}>
              <Add fontSize="large" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Bus List Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="bus tabs">
          <Tab label="All Buses" />
          <Tab label="Active" />
          <Tab label="Maintenance" />
        </Tabs>
      </Box>
      
      <Grid container spacing={3}>
        {buses
          .filter(bus => {
            if (tabValue === 0) return true;
            if (tabValue === 1) return bus.status === 'Active' || !bus.status;
            if (tabValue === 2) return bus.status === 'Maintenance';
            return true;
          })
          .map((bus) => (
          <Grid item xs={12} sm={6} md={4} key={bus._id}>
            <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {bus.status && bus.status !== 'Active' && (
                <Chip 
                  label={bus.status} 
                  color={bus.status === 'Maintenance' ? 'warning' : 'error'} 
                  size="small"
                  sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                />
              )}
              {bus.image && (
                <Box sx={{ height: 140, overflow: 'hidden' }}>
                  <img 
                    src={bus.image} 
                    alt={`Bus ${bus.busNo}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {bus.busNo}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {bus.type || 'Regular'} Bus
                </Typography>
                <Typography color="text.secondary">
                  <EventSeat fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {bus.busSeat} Seats
                </Typography>
                {bus.features && bus.features.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {bus.features.map(feature => (
                      <Chip 
                        key={feature} 
                        label={feature} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Edit />} onClick={() => handleOpen(bus)}>Edit</Button>
                <Button size="small" startIcon={<Info />} onClick={() => handleScheduleOpen(bus)}>Schedule</Button>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDelete(bus._id)}
                  sx={{ ml: 'auto' }}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Add/Edit Bus Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Bus' : 'Add New Bus'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                name="busNo"
                label="Bus Number"
                type="text"
                fullWidth
                value={formData.busNo}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Bus Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Bus Type"
                  onChange={handleChange}
                >
                  {busTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="busSeat"
                label="Number of Seats"
                type="number"
                fullWidth
                value={formData.busSeat}
                onChange={handleChange}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="image"
                label="Image URL"
                type="text"
                fullWidth
                value={formData.image}
                onChange={handleChange}
                helperText="Enter URL of bus image"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {busFeatures.map(feature => (
                  <Chip 
                    key={feature}
                    label={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    color={formData.features.includes(feature) ? 'primary' : 'default'}
                    variant={formData.features.includes(feature) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bus Schedule Dialog */}
      <Dialog open={scheduleOpen} onClose={handleScheduleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Bus Schedule: {currentBus?.busNo}
        </DialogTitle>
        <DialogContent>
          {currentSchedule.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {currentSchedule.map(schedule => (
                <Grid item xs={12} key={schedule._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{schedule.route}</Typography>
                          <Typography color="text.secondary">
                            Departure: {schedule.departure} | Arrival: {schedule.arrival}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">Operating days:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {schedule.days.map(day => (
                              <Chip key={day} label={day} size="small" />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="subtitle1">No schedules found for this bus</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                startIcon={<Add />}
              >
                Add Schedule
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleScheduleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertMessage.severity}
          sx={{ width: '100%' }}
        >
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageBuses;
