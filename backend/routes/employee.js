const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.post("/add", employeeController.addEmployee);
router.get("/", employeeController.getEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.put("/update/:id", employeeController.updateEmployee);
router.delete("/delete/:id", employeeController.deleteEmployee);

module.exports = router;
