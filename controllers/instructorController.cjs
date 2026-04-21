const Instructor = require("../models/instructorModel.cjs");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.cjs");

exports.add = async (req, res) => {
  try {
    const currentRole = req.session?.user?.role || null;

    if (currentRole !== "admin") {
      return res.status(403).json({
        message: "Only admins can add instructors with login accounts"
      });
    }

    const {
      instructorId,
      firstName,
      lastName,
      email,
      phone,
      address,
      pref,
      username,
      password
    } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and temporary password are required"
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newInstructor = new Instructor({
      instructorId,
      firstName,
      lastName,
      email,
      phone,
      address,
      pref
    });

    await newInstructor.save();

    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      username,
      passwordHash,
      role: "instructor",
      customerId: null
    });

    res.status(201).json({
      message: "Instructor added successfully",
      instructor: newInstructor,
      userCreated: true,
      user: {
        username: createdUser.username,
        role: createdUser.role
      }
    });
  } catch (err) {
    console.error("Error adding instructor:", err);
    res.status(500).json({
      message: err.message || "Failed to add instructor"
    });
  }
};

exports.getNextId = async (req, res) => {
  try {
    const lastInstructor = await Instructor.find({})
      .sort({ instructorId: -1 })
      .limit(1);

    let maxNumber = 1;
    if (lastInstructor.length > 0) {
      const lastId = lastInstructor[0].instructorId;
      const match = lastId.match(/\d+$/);
      if (match) {
        maxNumber = parseInt(match[0], 10) + 1;
      }
    }

    const nextId = `Y${String(maxNumber).padStart(3, "0")}`;
    res.json({ nextId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.search = async (req, res) => {
  const q = req.query.q || "";
  const results = await Instructor.find({
    $or: [
      { firstName: new RegExp(q, "i") },
      { lastName: new RegExp(q, "i") },
      { email: new RegExp(q, "i") },
      { phone: new RegExp(q, "i") }
    ]
  });
  res.json(results);
};

exports.getOne = async (req, res) => {
  const instructor = await Instructor.findOne({
    instructorId: req.params.instructorId
  });
  res.json(instructor);
};

exports.update = async (req, res) => {
  const updated = await Instructor.findOneAndUpdate(
    { instructorId: req.params.instructorId },
    req.body,
    { new: true }
  );
  res.json({ message: "Updated", instructor: updated });
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Instructor.findOneAndDelete({
      instructorId: req.params.instructorId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.json({ message: "Instructor deleted", instructor: deleted });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete instructor",
      error: err.message
    });
  }
};