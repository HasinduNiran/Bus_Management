import mongoose from "mongoose";

const bookingschema = mongoose.Schema(
    {
        bookingID: {
            type: String, // Changed to String type for custom format
            unique:true,
        },
        busID: {
            type: String,
            required: true,
        },
        routeID: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        seats: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        passengerID: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// Export the model
const Booking = mongoose.model('Booking', bookingschema);
export default Booking;