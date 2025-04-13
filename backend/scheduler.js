import cron from 'node-cron';
import mongoose from 'mongoose';

console.log('Scheduler initialized');

// Helper function to check if database is connected
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1; // 1 means connected
};

// Safely execute database operations with proper error handling
const safeDbOperation = async (operation, fallback = null) => {
  if (!isDatabaseConnected()) {
    console.log('Database not connected, skipping scheduled operation');
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Error in scheduled database operation:', error.message);
    return fallback;
  }
};

// Check for expired bookings
const checkExpiredBookings = async () => {
  console.log('Running scheduled task: checking expired bookings');
  
  await safeDbOperation(async () => {
    // Only try to access the database if connected
    if (isDatabaseConnected()) {
      const Booking = mongoose.model('Booking');
      const today = new Date();
      
      // Find bookings with dates in the past that are still 'confirmed'
      const expiredBookings = await Booking.find({
        status: 'confirmed',
        date: { $lt: today.toISOString().split('T')[0] }
      });
      
      console.log(`Found ${expiredBookings.length} expired bookings`);
      
      // Update status to 'expired'
      for (const booking of expiredBookings) {
        booking.status = 'expired';
        await booking.save();
      }
    }
  });
};

// Schedule tasks to be run on the server
cron.schedule('0 0 * * *', checkExpiredBookings); // Run at midnight every day

// Also run once at startup
setTimeout(checkExpiredBookings, 5000); // Wait 5 seconds after startup before checking
