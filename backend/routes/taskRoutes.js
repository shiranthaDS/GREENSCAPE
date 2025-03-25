const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/add", taskController.addTask);
router.get("/", taskController.getAllTasks);
router.put("/update/:id", taskController.updateTask);
router.delete("/delete/:id", taskController.deleteTask);

module.exports = router;
