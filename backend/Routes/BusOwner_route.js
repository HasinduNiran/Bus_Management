import express from 'express';
import { BusOwner } from '../Model/BusOwner.js'; // Import the BusOwner model

const router = express.Router();

// Route to get all bus owners
router.get('/', async (req, res) => {
  try {
    const busOwners = await BusOwner.find();
    res.status(200).json(busOwners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bus owners', error });
  }
});

// Route to get a bus owner by ID
router.get('/:id', async (req, res) => {
  try {
    const busOwner = await BusOwner.findById(req.params.id);
    if (!busOwner) {
      return res.status(404).json({ message: 'Bus owner not found' });
    }
    res.status(200).json(busOwner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bus owner', error });
  }
});

// Route to create a new bus owner
router.post('/', async (req, res) => {
  try {
    const { busOwnID, image, firstName, lastName, NIC, phone, email, password } = req.body;

    // Check if bus owner already exists (email or NIC)
    const existingBusOwner = await BusOwner.findOne({ $or: [{ email }, { NIC }] });
    if (existingBusOwner) {
      return res.status(400).json({ message: 'Bus owner with the same email or NIC already exists' });
    }

    const newBusOwner = new BusOwner({ busOwnID, image, firstName, lastName, NIC, phone, email, password });
    await newBusOwner.save();
    res.status(201).json({ message: 'Bus owner created successfully', newBusOwner });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bus owner', error });
  }
});

// Route to update a bus owner
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const updatedBusOwner = await BusOwner.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedBusOwner) {
      return res.status(404).json({ message: 'Bus owner not found' });
    }

    res.status(200).json({ message: 'Bus owner updated successfully', updatedBusOwner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bus owner', error });
  }
});

// Route to delete a bus owner
router.delete('/:id', async (req, res) => {
  try {
    const deletedBusOwner = await BusOwner.findByIdAndDelete(req.params.id);
    if (!deletedBusOwner) {
      return res.status(404).json({ message: 'Bus owner not found' });
    }
    res.status(200).json({ message: 'Bus owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bus owner', error });
  }
});

export default router;
