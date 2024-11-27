import mongoose from "mongoose";

const busSchema = mongoose.Schema(
    {
        busNo: {
            type: String, // Changed to String type for custom format
            unique:true,
            required:true,
        },
        image: { 
            type: String,
           
        },
        
        busSeat:{
            type:Number,
            required:true,
        }
         
    },
    {
        timestamps: true,
    }
);

 

export const Bus = mongoose.model('Bus', busSchema);