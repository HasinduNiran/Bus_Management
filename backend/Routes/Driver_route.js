import express from 'express';
import Driver from '../Model/Driver.js';

const router = express.Router();

// Route to get all drivers
router.get("/",async(req,res )=>{
try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drivers", error });
  
}
});

// Route to get a driver by ID

router.get("/:id", async(req,res )=>{
try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver", error });
  }
});

// Route to create a new driver

router.post("/", async(req,res )=>{
const driver = new Driver(req.body);
try {
    const newDriver = await driver.save();
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(400).json({ message: "Invalid driver data", error });
  }
});

// Route to update a driver

router.put("/:id", async(req,res )=>{
const { id: _id,...newDriverData } = req.body;
try {
    const driver = await Driver.findByIdAndUpdate(_id, newDriverData, { new: true });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Error updating driver", error });
  }
});

// Route to delete a driver

router.delete("/:id", async(req,res )=>{
try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting driver", error });
  }
});

export default router;


