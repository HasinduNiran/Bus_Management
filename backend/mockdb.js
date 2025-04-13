/**
 * Simple in-memory data store for development without MongoDB
 * This provides basic CRUD operations that mimic MongoDB functionality
 */

// In-memory collections
const collections = {
  customers: [],
  busowners: [],
  buses: [],
  drivers: [],
  conductors: [],
  bookings: [],
};

// Mock ID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock MongoDB operations
export const mockDb = {
  // Find all documents in a collection
  find: (collectionName, query = {}) => {
    const collection = collections[collectionName] || [];
    
    // Simple query filtering (supports only basic equality)
    if (Object.keys(query).length === 0) {
      return Promise.resolve([...collection]);
    }
    
    const filtered = collection.filter(item => {
      return Object.entries(query).every(([key, value]) => item[key] === value);
    });
    
    return Promise.resolve(filtered);
  },
  
  // Find one document by ID or query
  findOne: (collectionName, query) => {
    const collection = collections[collectionName] || [];
    
    // If query is just an ID string
    if (typeof query === 'string') {
      const found = collection.find(item => item._id === query);
      return Promise.resolve(found || null);
    }
    
    // Otherwise, it's an object query
    const found = collection.find(item => {
      return Object.entries(query).every(([key, value]) => item[key] === value);
    });
    
    return Promise.resolve(found || null);
  },
  
  // Create a new document
  create: (collectionName, data) => {
    if (!collections[collectionName]) {
      collections[collectionName] = [];
    }
    
    const newItem = {
      _id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    
    collections[collectionName].push(newItem);
    return Promise.resolve({...newItem});
  },
  
  // Update a document
  updateOne: (collectionName, query, update) => {
    const collection = collections[collectionName] || [];
    let found = null;
    
    // Find the item index
    let foundIndex = -1;
    if (typeof query === 'string') {
      foundIndex = collection.findIndex(item => item._id === query);
    } else {
      foundIndex = collection.findIndex(item => {
        return Object.entries(query).every(([key, value]) => item[key] === value);
      });
    }
    
    // Update if found
    if (foundIndex !== -1) {
      collections[collectionName][foundIndex] = {
        ...collections[collectionName][foundIndex],
        ...update,
        updatedAt: new Date()
      };
      found = collections[collectionName][foundIndex];
    }
    
    return Promise.resolve(found);
  },
  
  // Delete a document
  deleteOne: (collectionName, query) => {
    const collection = collections[collectionName] || [];
    let deleted = null;
    
    // Find the item index
    let foundIndex = -1;
    if (typeof query === 'string') {
      foundIndex = collection.findIndex(item => item._id === query);
    } else {
      foundIndex = collection.findIndex(item => {
        return Object.entries(query).every(([key, value]) => item[key] === value);
      });
    }
    
    // Delete if found
    if (foundIndex !== -1) {
      deleted = collections[collectionName].splice(foundIndex, 1)[0];
    }
    
    return Promise.resolve(deleted);
  }
};

// Export mock collections to access the raw data
export const mockCollections = collections;

// Add some initial data
mockDb.create('customers', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: '12345',
  customerID: 'CUS12345'
});

mockDb.create('busowners', {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  password: '12345',
  busOwnerID: 'OWN12345'
});

mockDb.create('buses', {
  busNo: 'BUS001',
  busSeat: 42,
  busOwnerID: 'OWN12345'
});

mockDb.create('drivers', {
  firstName: 'Mike',
  lastName: 'Johnson',
  email: 'mike@example.com',
  password: '12345',
  driverID: 'DRV12345'
});

mockDb.create('conductors', {
  firstName: 'Sarah',
  lastName: 'Wilson',
  email: 'sarah@example.com',
  password: '12345',
  conductorID: 'CND12345'
});

console.log('Mock database initialized with sample data');
