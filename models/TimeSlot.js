const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true // "9:00 AM"
  },
  value: {
    type: String,
    required: true // "09:00" (24-hour format)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
