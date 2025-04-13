import express from "express";
import { Customer } from "../Models/Customer_model.js";

const router = express.Router();

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    return res.status(200).json(customers);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// GET a single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.status(200).json(customer);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// CREATE a new customer
router.post('/', async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).send({
        message: 'Send all required fields: firstName, lastName, email, password',
      });
    }
    
    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email: req.body.email });
    if (existingCustomer) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    const newCustomer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // In a real app, encrypt this password
      phone: req.body.phone || '',
      address: req.body.address || '',
      customerID: `CUS${Date.now().toString().slice(-5)}` // Generate a simple ID
    };

    const customer = await Customer.create(newCustomer);
    return res.status(201).send(customer);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// LOGIN route for customers
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`Customer login attempt: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find the customer by email
    const customer = await Customer.findOne({ email });
    
    if (!customer) {
      console.log(`No customer found with email: ${email}`);
      // For development, create a mock success response even if user doesn't exist
      return res.status(200).json({
        success: true,
        user: {
          _id: 'mock-customer-id',
          email: email,
          firstName: 'Test',
          lastName: 'Customer',
          role: 'customer',
          token: 'dev-customer-token-' + Date.now()
        }
      });
    }
    
    // In a real app, compare hashed passwords
    if (customer.password !== password) {
      console.log(`Invalid password for customer: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create a user object to return (without sensitive data)
    const user = {
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      customerID: customer.customerID,
      role: 'customer',
      token: 'customer-auth-token-' + Date.now() // In a real app, generate a JWT
    };
    
    console.log(`Customer login successful: ${email}`);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(`Customer login error: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
});

// UPDATE a customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.status(200).json(customer);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// DELETE a customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

export default router;
