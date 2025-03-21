const express = require("express");
const multer = require("multer");
const path = require("path");
const Service = require("../models/Service");

const router = express.Router();

// Image Upload Config
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Add Service
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { name, description, moreInfo } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        const service = new Service({ name, description, moreInfo, imageUrl });
        await service.save();

        res.status(201).json({ message: "Service added successfully", service });
    } catch (error) {
        res.status(500).json({ message: "Error adding service", error });
    }
});

// Get All Services
router.get("/", async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error });
    }
});
// DELETE: Remove a service
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error });
    }
});
// UPDATE Service Route
router.put("/update/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, description, moreInfo } = req.body;
        const serviceId = req.params.id;

        // Find existing service
        let service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Update service fields
        service.name = name;
        service.description = description;
        service.moreInfo = moreInfo;

        // If a new image is uploaded, update the image URL
        if (req.file) {
            service.imageUrl = `/uploads/${req.file.filename}`;
        }

        // Save updated service
        await service.save();
        res.status(200).json({ message: "Service updated successfully", service });

    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
