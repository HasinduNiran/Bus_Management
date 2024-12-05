import expres from 'express';
import Conductor from '../Model/Conductor.js';

const router = expres.Router();

// Get all conductors
router.get('/', async (req, res) => {
  try {
    const conductors = await Conductor.find();
    res.status(200).json(conductors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conductors', error });
  }
});

// Get a conductor by ID
router.get('/:id', async (req, res) => {
  try {
    const conductor = await Conductor.findById(req.params.id);
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor not found' });
    }
    res.status(200).json(conductor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conductor', error });
  }
});

// Create a new conductor

router.post('/', async (req, res) => {
  try {
    const newConductor = new Conductor(req.body);
    const conductor = await newConductor.save();
    res.status(201).json(conductor);
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

// Update a conductor by ID
router.put('/:id', async (req, res) => {
  try {
    const conductor = await Conductor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor not found' });
    }
    res.status(200).json(conductor);
    } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
    }
}
);

// Delete a conductor by ID

router.delete('/:id', async (req, res) => {
  try {
    const conductor = await Conductor.findByIdAndDelete(req.params.id);
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor not found' });
    }
    res.status(200).json({ message: 'Conductor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting conductor', error });
  }
});

export default router;
    