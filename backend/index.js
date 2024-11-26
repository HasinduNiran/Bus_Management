import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import "./scheduler.js";

// Importing custom configurations
import { PORT, mongoDBURL } from "./config.js";


const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

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