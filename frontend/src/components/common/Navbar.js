import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isLoggedIn, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <Button 
            color="inherit" 
            onClick={handleMenuOpen}
          >
            Dashboard
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {userRole === 'customer' && (
              [
                <MenuItem key="dashboard" onClick={() => { handleMenuClose(); navigate('/customer/dashboard'); }}>
                  Dashboard
                </MenuItem>,
                <MenuItem key="book" onClick={() => { handleMenuClose(); navigate('/customer/book-ticket'); }}>
                  Book Ticket
                </MenuItem>,
                <MenuItem key="bookings" onClick={() => { handleMenuClose(); navigate('/customer/bookings'); }}>
                  My Bookings
                </MenuItem>
              ]
            )}
            {userRole === 'busowner' && (
              [
                <MenuItem key="dashboard" onClick={() => { handleMenuClose(); navigate('/busowner/dashboard'); }}>
                  Dashboard
                </MenuItem>,
                <MenuItem key="buses" onClick={() => { handleMenuClose(); navigate('/busowner/buses'); }}>
                  Manage Buses
                </MenuItem>,
                <MenuItem key="drivers" onClick={() => { handleMenuClose(); navigate('/busowner/drivers'); }}>
                  View Drivers
                </MenuItem>
              ]
            )}
            {userRole === 'driver' && (
              [
                <MenuItem key="dashboard" onClick={() => { handleMenuClose(); navigate('/driver/dashboard'); }}>
                  Dashboard
                </MenuItem>,
                <MenuItem key="schedule" onClick={() => { handleMenuClose(); navigate('/driver/schedule'); }}>
                  View Schedule
                </MenuItem>
              ]
            )}
            {userRole === 'conductor' && (
              [
                <MenuItem key="dashboard" onClick={() => { handleMenuClose(); navigate('/conductor/dashboard'); }}>
                  Dashboard
                </MenuItem>,
                <MenuItem key="verify" onClick={() => { handleMenuClose(); navigate('/conductor/verify-tickets'); }}>
                  Verify Tickets
                </MenuItem>
              ]
            )}
          </Menu>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </>
      );
    } else {
      return (
        <>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
        </>
      );
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          Bus Management System
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {renderAuthButtons()}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
