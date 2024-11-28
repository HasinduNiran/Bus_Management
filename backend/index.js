import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import "./scheduler.js";

import customerRoutes from './Routes/Customer_route.js';
import busOwnerRoutes from './Routes/BusOwner_route.js';
import busRoutes from './Routes/Bus_route.js';


// Importing custom configurations
import { PORT, mongoDBURL } from "./config.js";


const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

app.use('/Customer', customerRoutes);
app.use('/BusOwner', busOwnerRoutes);
app.use('/Bus', busRoutes);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });