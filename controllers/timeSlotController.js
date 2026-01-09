const TimeSlot = require("../models/TimeSlot");

exports.getActiveTimeSlots = async (req, res) => {
  try {
    const activeSlots = await TimeSlot.find({ isActive: true }).sort({ value: 1 });
    res.json(activeSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find().sort({ value: 1 });
    res.status(200).json(timeSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await TimeSlot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    slot.isActive = !slot.isActive;
    await slot.save();

    res.json({
      message: `Time slot ${slot.isActive ? "activated" : "deactivated"}`,
      slot
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addTimeSlot = async (req, res) => {
  try {
    const { label, value } = req.body;

    if (!label || !value) {
      return res
        .status(400)
        .json({ message: "Label and value are required" });
    }

    // prevent duplicates
    const exists = await TimeSlot.findOne({ value });
    if (exists) {
      return res.status(400).json({
        message: "Time slot already exists",
      });
    }

    const slot = await TimeSlot.create({
      label,
      value,
      isActive: true,
    });

    res.status(201).json({
      message: "Time slot added successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add time slot" });
  }
};


exports.deleteTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.findByIdAndDelete(req.params.id);
    if (!slot)
      return res.status(404).json({ message: "Time slot not found" });

    res.status(200).json({
      message: "Time slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete time slot" });
  }
};