
const express = require("express");
const Employee = require("../models/Employee");

const {
  authMiddleware,
  adminMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/employees/my-profile
// Fetch logged-in employee profile
router.get("/my-profile", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      email: req.user.email
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found"
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile"
    });
  }
});

// PUT /api/employees/my-profile
// Update logged-in employee profile
router.put("/my-profile", authMiddleware, async (req, res) => {
  try {
    const { department, designation, mobile } = req.body;

    if (
      typeof department !== "string" ||
      !department.trim() ||
      typeof designation !== "string" ||
      !designation.trim() ||
      typeof mobile !== "string" ||
      !mobile.trim()
    ) {
      return res.status(400).json({
        message: "Department, designation and mobile are required"
      });
    }

    const employee = await Employee.findOne({
      email: req.user.email
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found"
      });
    }

    employee.department = department.trim();
    employee.designation = designation.trim();
    employee.mobile = mobile.trim();

    await employee.save();

    res.json({
      message: "Profile updated successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile"
    });
  }
});

// GET /api/employees - View employees
router.get("/", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees"
    });
  }
});

// POST /api/employees - Add employee (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      employeeName,
      department,
      designation,
      email,
      mobile
    } = req.body;

    if (!employeeName || !department || !designation || !email || !mobile) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await Employee.findOne({
      email: normalizedEmail
    });

    if (existing) {
      return res.status(409).json({
        message: "Employee email already exists"
      });
    }

    const employee = await Employee.create({
      employeeId: `EMP-${Date.now()}`,
      employeeName,
      department,
      designation,
      email: normalizedEmail,
      mobile
    });

    res.status(201).json({
      message: "Employee added successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add employee"
    });
  }
});

// PUT /api/employees/:id - Update employee (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update employee"
    });
  }
});

// DELETE /api/employees/:id - Delete employee (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      message: "Employee deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete employee"
    });
  }
});

module.exports = router;
