import express from 'express';
import { Bus } from '../Model/Bus.js'; // Import the Bus model

const router = express.Router();

// Route to get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buses', error });
  }
});

// Route to get a bus by ID
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bus', error });
  }
});

// Route to create a new bus
router.post('/', async (req, res) => {
  try {
    const { busNo, image, busSeat } = req.body;

    // Check if bus number already exists
    const existingBus = await Bus.findOne({ busNo });
    if (existingBus) {
      return res.status(400).json({ message: 'Bus with the same number already exists' });
    }

    const newBus = new Bus({ busNo, image, busSeat });
    await newBus.save();
    res.status(201).json({ message: 'Bus created successfully', newBus });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bus', error });
  }
});

// Route to update a bus
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.status(200).json({ message: 'Bus updated successfully', updatedBus });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bus', error });
  }
});

// Route to delete a bus
router.delete('/:id', async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    if (!deletedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bus', error });
  }
});

export default router;
