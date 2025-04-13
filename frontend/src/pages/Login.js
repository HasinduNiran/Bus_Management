import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ApiTester from '../components/utils/ApiTester'; // Import the tester

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTester, setShowTester] = useState(false); // Add state for tester
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password, role);
      
      switch(role) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'busowner':
          navigate('/busowner/dashboard');
          break;
        case 'driver':
          navigate('/driver/dashboard');
          break;
        case 'conductor':
          navigate('/conductor/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(`Login failed: ${error.message}. Please check your credentials or contact support.`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>User Type</InputLabel>
            <Select
              value={role}
              label="User Type"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="busowner">Bus Owner</MenuItem>
              <MenuItem value="driver">Driver</MenuItem>
              <MenuItem value="conductor">Conductor</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        {/* Developer mode toggle */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="text" 
            size="small" 
            onClick={() => setShowTester(!showTester)}
            sx={{ fontSize: '0.8rem', color: 'text.secondary' }}
          >
            {showTester ? 'Hide API Tester' : 'Developer Mode'}
          </Button>
        </Box>
        
        {/* API Tester for development */}
        {showTester && <ApiTester />}
      </Paper>
    </Container>
  );
};

export default Login;
