const Appointment = require("../models/Appointment");
const axios = require("axios");


// exports.bookAppointment = async (req, res) => {
//   try {
//     const { reference, appointmentData } = req.body;
//     const userId = req.user.id;

//     if (!reference || !appointmentData) {
//       return res.status(400).json({ message: "Missing payment reference or appointment data" });
//     }

//     const paystackRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     });

//     const payment = paystackRes.data;

//     if (!payment.status || payment.data.status !== "success") {
//       return res.status(400).json({ message: "Payment not successful" });
//     }

//     const { service, firstname, lastname, phone1, phone2, address, date, time } = appointmentData;

//     const exists = await Appointment.findOne({ date, time });
//     if (exists) {
//       return res.status(400).json({ message: "This time slot is already booked." });
//     }
//     const newAppointment = new Appointment({
//       user: userId,
//       service,
//       firstname,
//       lastname,
//       phone1,
//       phone2,
//       address,
//       date,
//       time,
//     });

//     await newAppointment.save();

//     return res.status(201).json({ message: "Appointment booked successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Error booking appointment", error: error.message });
//   }
// };


// controllers/appointmentController.js


exports.checkAvailability = async (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ message: "Missing date or time" });
    }

    const exists = await Appointment.findOne({ date, time });

    if (exists) {
      return res.status(409).json({ message: "Time slot already booked." });
    }

    return res.status(200).json({ message: "Slot available." });
  } catch (err) {
    return res.status(500).json({ message: "Error checking availability", error: err.message });
  }
};


exports.bookAppointment = async (req, res) => {
  try {

    const { reference, appointmentData } = req.body;
    const userId = req.user.id;

    if (!reference || !appointmentData) {
      return res
        .status(400)
        .json({ message: "Missing payment reference or appointment data" });
    }

    const { service, firstname, lastname, phone1, phone2, address, date, time, price } = appointmentData;

    
    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

   
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const payment = paystackRes.data;

   
    if (
      !payment.status || 
      !payment.data || 
      payment.data.status !== "success" || 
      payment.data.amount < 100 
    ) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    
    const stillAvailable = await Appointment.findOne({ date, time });
    if (stillAvailable) {
      return res.status(409).json({
        message: "Sorry, someone just booked this slot while payment was processing.",
      });
    }

   
    const newAppointment = new Appointment({
      user: userId,
      service,
      firstname,
      lastname,
      phone1,
      phone2,
      address,
      date,
      time,
      price,
    });

    await newAppointment.save();

    return res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Booking error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Error booking appointment",
      error: error.response?.data || error.message,
    });
  }
};


exports.getSlots = async (req, res) => {
  const { date } = req.query;

  if (!date) return res.status(400).json({ error: "Date is required" });

  // const allSlots = ["9am", "12pm", "2pm", "5pm"];

   const allSlots = [
  { label: "7AM", value: "07:00" },
  { label: "9AM", value: "09:00" },
  { label: "11AM", value: "11:00" },
  { label: "1PM", value: "13:00" },
  { label: "3PM", value: "15:00" },
  { label: "5PM", value: "17:00" },
  { label: "7PM", value: "19:00" },
  { label: "9PM", value: "21:00" },
];

  const appointments = await Appointment.find({ date });
  const bookedCount = appointments.length;
  const totalSlots = 8;

  const bookedTimes = appointments.map((a) => a.time);

  const availableSlotTimes = allSlots?.label?.filter(slot => !bookedTimes.includes(slot));

  const availableSlotsCount = totalSlots - bookedCount;

  res.status(200).json({ availableSlots: availableSlotsCount, availableSlotTimes });
};

exports.getUserAppointments = async (req, res) => {
  const  userId  = req.user._id;

  try {
    const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};
