
const express = require("express");
const User = require("../models/User");
const Employee = require("../models/Employee");
const LeaveApplication = require("../models/LeaveApplication");
const {
  authMiddleware,
  adminMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/leaveApplications - Apply for leave
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    if (!employeeId || !leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({
        message: "To date must be on or after from date"
      });
    }

    const leave = await LeaveApplication.create({
      leaveId: `LEV-${Date.now()}`,
      employeeId,
      leaveType,
      fromDate,
      toDate,
      reason,
      applicationDate: new Date(),
      leaveStatus: "Pending"
    });

    res.status(201).json({
      message: "Leave application submitted successfully",
      leave
    });
  } catch (error) {
    res.status(400).json({
      message: "Leave application failed",
      error: error.message
    });
  }
});

// GET /api/leaveApplications - View leave applications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const leaves = await LeaveApplication.find();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave applications" });
  }
});


/* PUT /api/leaveApplications/:id
   Admin approves or rejects a leave request */

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { leaveStatus } = req.body;

    if (!["Approved", "Rejected"].includes(leaveStatus)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected"
      });
    }

    const leave = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      { leaveStatus },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave application not found"
      });
    }

    res.json({
      message: `Leave ${leaveStatus.toLowerCase()} successfully`,
      leave
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update leave status"
    });
  }
});


/* GET /api/leaveApplications/my/:employeeId
   View leave history for one employee */


router.get("/my/:employeeId", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const user = await User.findOne({
      userId: req.user.userId
    });

    if (
      req.user.role !== "Admin" &&
      (!user || user.email !== employee.email)
    ) {
      return res.status(403).json({
        message: "You can view only your own leave history"
      });
    }

    const leaves = await LeaveApplication.find({
      employeeId: employee.employeeId
    }).sort({ applicationDate: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leave history"
    });
  }
});


module.exports = router;
