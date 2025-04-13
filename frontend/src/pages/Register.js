import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    NIC: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        ...formData,
        // Add specific ID field based on role
        ...(role === 'customer' && { cusID: `CUS${Date.now().toString().slice(-6)}` }),
        ...(role === 'busowner' && { busOwnID: `OWN${Date.now().toString().slice(-6)}` }),
        ...(role === 'driver' && { driverID: `DRV${Date.now().toString().slice(-6)}` }),
        ...(role === 'conductor' && { conductorID: `CON${Date.now().toString().slice(-6)}` })
      };
      
      delete userData.confirmPassword;
      
      await register(userData, role);
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError('Failed to register. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Register
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Register As</InputLabel>
            <Select
              value={role}
              label="Register As"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="busowner">Bus Owner</MenuItem>
              <MenuItem value="driver">Driver</MenuItem>
              <MenuItem value="conductor">Conductor</MenuItem>
            </Select>
          </FormControl>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                margin="normal"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                margin="normal"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="NIC"
                name="NIC"
                fullWidth
                margin="normal"
                value={formData.NIC}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
