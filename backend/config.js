export const PORT = 8077;

export const mongoDBURL='mongodb+srv://hasinduniran29:hasi21@cluster0.ynv5hxu.mongodb.net/bus_management_db?retryWrites=true&w=majority'

// Add missing exports needed by index.js
export const dbOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

// Set to false since we have a valid MongoDB Atlas connection
export const MOCK_DB = false;

