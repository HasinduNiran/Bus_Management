import express from 'express';
import Booking from '../Model/Booking.js';

const router = express.Router();


// Route to create a new booking

router.post('/', async (req, res) => {
    try {
        const book = new Booking(req.body);
        await book.save();
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
});

// Get a booking by ID
router.get('/:id', async(req, res) => {
    try {
        const book = await Booking.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(book);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error });
    }
}
);
// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
});

// Update a booking by ID
router.put('/:id',async(req,res) =>{
    try{
        const updates = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id,updates,{new:true});
        if(!updatedBooking){
            return res.status(404).json({message:'Booking not found'});
        }
    }catch(err){
        res.status(500).json({message:"Error updating booking",err});
    }
});

// Delete a booking by ID

router.delete('/:id',async(req,res) =>{
    try{
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if(!booking){
            return res.status(404).json({message:'Booking not found'});
        }
    }catch(err){
        res.status(500).json({message:"Error deleting booking",err});
    }
}
);

export default router;