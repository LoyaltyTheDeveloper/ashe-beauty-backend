const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 service: [
    {
      name: { type: String, required: true }, 
      price: { type: Number, default: 0 }
    },
  ],
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone1: { type: String, required: true },
  phone2: { type: String, required: true},
  address: { type: String },
  date: { type: String, required: true }, 
  time: { type: String, required: true }, 
  price: { type: Number, required: true },
},
{ timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
