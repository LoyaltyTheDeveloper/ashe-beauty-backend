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
