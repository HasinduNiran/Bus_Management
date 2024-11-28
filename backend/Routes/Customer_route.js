import express from 'express';
import { Customer } from '../Model/customer.js'; // Import the Customer model
import mongoose from 'mongoose';

const router = express.Router();

// Route to get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
});

// Route to get a customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});

// Route to create a new customer
router.post('/', async (req, res) => {
  try {
    const { cusID, image, firstName, lastName, NIC, phone, email, password } = req.body;

    // Check if customer already exists (email or NIC)
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { NIC }] });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with the same email or NIC already exists' });
    }

    const newCustomer = new Customer({ cusID, image, firstName, lastName, NIC, phone, email, password });
    await newCustomer.save();
    res.status(201).json({ message: 'Customer created successfully', newCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
});

// Route to update a customer
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
});

// Route to delete a customer
router.delete('/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});

export default router;
