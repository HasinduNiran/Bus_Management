import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/Customer/Dashboard';
import BusOwnerDashboard from './pages/BusOwner/Dashboard';
import DriverDashboard from './pages/Driver/Dashboard';
import ConductorDashboard from './pages/Conductor/Dashboard';
import BookTicket from './pages/Customer/BookTicket';
import ViewBookings from './pages/Customer/ViewBookings';
import ManageBuses from './pages/BusOwner/ManageBuses';
import ViewDrivers from './pages/BusOwner/ViewDrivers';
import ViewSchedule from './pages/Driver/ViewSchedule';
import VerifyTickets from './pages/Conductor/VerifyTickets';
import ManageSchedules from './pages/BusOwner/ManageSchedules';
import ManageRoutes from './pages/BusOwner/ManageRoutes';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Customer Routes */}
          <Route path="/customer/*" element={
            <ProtectedRoute role="customer">
              <Routes>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="book-ticket" element={<BookTicket />} />
                <Route path="bookings" element={<ViewBookings />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Bus Owner Routes */}
          <Route path="/busowner/*" element={
            <ProtectedRoute role="busowner">
              <Routes>
                <Route path="dashboard" element={<BusOwnerDashboard />} />
                <Route path="buses" element={<ManageBuses />} />
                <Route path="drivers" element={<ViewDrivers />} />
                <Route path="schedules" element={<ManageSchedules />} />
                <Route path="routes" element={<ManageRoutes />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Driver Routes */}
          <Route path="/driver/*" element={
            <ProtectedRoute role="driver">
              <Routes>
                <Route path="dashboard" element={<DriverDashboard />} />
                <Route path="schedule" element={<ViewSchedule />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Conductor Routes */}
          <Route path="/conductor/*" element={
            <ProtectedRoute role="conductor">
              <Routes>
                <Route path="dashboard" element={<ConductorDashboard />} />
                <Route path="verify-tickets" element={<VerifyTickets />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
