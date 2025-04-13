import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Bus Management System
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Book your bus tickets easily and manage your travel efficiently
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            to="/register"
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Our Services
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/?bus"
                alt="Bus booking"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Easy Booking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Book bus tickets online with just a few clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/?schedule"
                alt="Schedule management"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Route Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Efficiently manage bus routes and schedules
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/?driver"
                alt="Driver management"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Driver Portal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dedicated interface for drivers to view schedules
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/?ticket"
                alt="Ticket verification"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Ticket Verification
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Conductors can easily verify and manage tickets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
