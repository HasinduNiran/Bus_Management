import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import "./scheduler.js";

import customerRoutes from './Routes/Customer_route.js';
import busOwnerRoutes from './Routes/BusOwner_route.js';
import busRoutes from './Routes/Bus_route.js';
import driverRoutes from './Routes/Driver_route.js';
import conductorRoutes from './Routes/Conductor_route.js';
import bookingRoutes from './Routes/Booking_route.js';

// Importing custom configurations
import { PORT, mongoDBURL, dbOptions, MOCK_DB } from "./config.js";

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY - Enhanced configuration
app.use(cors({
  origin: '*', // In production, change to your specific frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Generic auth route for simplified login during development
app.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`Login attempt: ${email}, role: ${role}`);
    
    // For testing/development, return a mock successful response
    res.status(200).json({
      success: true,
      user: {
        _id: 'temp-user-id',
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: role,
        token: 'dev-temp-token'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// API auth endpoint that frontend is trying to access
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(`API Login attempt: ${email}, role: ${role}`);
    
    // For testing/development, return a mock successful response
    res.status(200).json({
      success: true,
      user: {
        _id: 'temp-user-id',
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: role,
        token: 'dev-temp-token'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route paths for original route structure
app.use('/Customer', customerRoutes);
app.use('/BusOwner', busOwnerRoutes);
app.use('/Bus', busRoutes);
app.use('/Driver', driverRoutes);
app.use('/Conductor', conductorRoutes);
app.use('/Booking', bookingRoutes);

// API route paths (lowercase with /api/ prefix) that frontend is trying to access
app.use('/api/customer', customerRoutes);
app.use('/api/busowner', busOwnerRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/conductor', conductorRoutes);
app.use('/api/booking', bookingRoutes);

// Add a diagnostic endpoint to verify server is running
app.get('/api-status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    routes: [
      '/Customer/*', '/api/customer/*',
      '/BusOwner/*', '/api/busowner/*',
      '/Bus/*', '/api/bus/*',
      '/Driver/*', '/api/driver/*',
      '/Conductor/*', '/api/conductor/*',
      '/Booking/*', '/api/booking/*',
      '/login', '/api/auth/login'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection handling
if (MOCK_DB) {
  console.log("Running in MOCK DB mode - no MongoDB connection required");
  
  // Start the server immediately without waiting for MongoDB
  app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT} (MOCK DB mode)`);
  });
} else {
  // Attempt to connect to MongoDB
  mongoose
    .connect(mongoDBURL, dbOptions)
    .then(() => {
      console.log("App connected to database");
      app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
      });
    })
    .catch((error) => {
      console.log("MongoDB connection error:", error.message);
      console.log("Please make sure MongoDB is running and accessible.");
      console.log("Alternatives:");
      console.log("1. Install and start MongoDB locally");
      console.log("2. Use MongoDB Atlas cloud service");
      console.log("3. Set MOCK_DB=true in config.js to run without MongoDB");
      
      // Continue running the application even if DB connection fails
      app.listen(PORT, () => {
        console.log(`App is listening on port: ${PORT} (DB connection failed)`);
      });
    });
}