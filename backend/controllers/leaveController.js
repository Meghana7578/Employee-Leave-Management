const LeaveApplication = require("../models/LeaveApplication");

// Get all leave applications
const getLeaveApplications = async (req, res) => {
    try {
        const leaves = await LeaveApplication.find();

        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leave applications",
            error: error.message
        });
    }
};

// Create a new leave application
const createLeaveApplication = async (req, res) => {
    try {
        const leave = await LeaveApplication.create(req.body);

        res.status(201).json({
            message: "Leave application created successfully",
            leave
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create leave application",
            error: error.message
        });
    }
};

// Update a leave application
const updateLeaveApplication = async (req, res) => {
    try {
        const leave = await LeaveApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!leave) {
            return res.status(404).json({
                message: "Leave application not found"
            });
        }

        res.status(200).json({
            message: "Leave application updated successfully",
            leave
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update leave application",
            error: error.message
        });
    }
};

// Delete a leave application
const deleteLeaveApplication = async (req, res) => {
    try {
        const leave = await LeaveApplication.findByIdAndDelete(
            req.params.id
        );

        if (!leave) {
            return res.status(404).json({
                message: "Leave application not found"
            });
        }

        res.status(200).json({
            message: "Leave application deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete leave application",
            error: error.message
        });
    }
};

module.exports = {
    getLeaveApplications,
    createLeaveApplication,
    updateLeaveApplication,
    deleteLeaveApplication
};