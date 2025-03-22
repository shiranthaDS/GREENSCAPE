const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    addService,
    getAllServices,
    deleteService,
    updateService
} = require("../controllers/serviceController");

const router = express.Router();

// Image Upload Config
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Define routes and use controller functions
router.post("/add", upload.single("image"), addService);
router.get("/", getAllServices);
router.delete("/delete/:id", deleteService);
router.put("/update/:id", upload.single("image"), updateService);

module.exports = router;
