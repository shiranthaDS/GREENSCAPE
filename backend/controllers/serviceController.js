const Service = require("../models/Service");

// Add Service
const addService = async (req, res) => {
    try {
        const { name, description, moreInfo } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const service = new Service({ name, description, moreInfo, imageUrl });
        await service.save();

        res.status(201).json({ message: "Service added successfully", service });
    } catch (error) {
        res.status(500).json({ message: "Error adding service", error });
    }
};

// Get All Services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error });
    }
};

// Delete a Service
const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error });
    }
};

// Update Service
const updateService = async (req, res) => {
    try {
        const { name, description, moreInfo } = req.body;
        const serviceId = req.params.id;

        let service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        service.name = name;
        service.description = description;
        service.moreInfo = moreInfo;

        if (req.file) {
            service.imageUrl = `/uploads/${req.file.filename}`;
        }

        await service.save();
        res.status(200).json({ message: "Service updated successfully", service });

    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addService, getAllServices, deleteService, updateService };
