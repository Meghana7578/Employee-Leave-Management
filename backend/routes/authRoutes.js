
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, designation, mobile } = req.body;

    if (!name || !email || !password || !department || !designation || !mobile) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: `USR-${Date.now()}`,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "Employee"
    });

    await Employee.create({
      employeeId: `EMP-${Date.now()}`,
      employeeName: name,
      department,
      designation,
      email: normalizedEmail,
      mobile
    });

    res.status(201).json({
      message: "Employee registered successfully",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});


router.post("/login", async (req, res) => {
  console.log("LOGIN ROUTE HIT");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }
    
    
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    console.log("LOGIN USER:", user?.email, user?.role);
   console.log("PASSWORD MATCH:", user ? await bcrypt.compare(password, user.password) : "USER NOT FOUND");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const employee = await Employee.findOne({
      email: user.email
    });

    const token = jwt.sign(
      {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: employee ? employee.employeeId : null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        employeeId: employee ? employee.employeeId : null,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});
module.exports = router;