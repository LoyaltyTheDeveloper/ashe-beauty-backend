const Appointment = require("../models/Appointment");
const axios = require("axios");
const TimeSlot = require("../models/TimeSlot");


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
    const { date, time, timeId } = req.body;

    const slot = await TimeSlot.findById(timeId);

    if (slot.isActive === false) {
      return res.status(400).json({ message: "This time slot is not available for booking." });
    }
    
    if (!date || !time) {
      return res.status(400).json({ message: "Missing date or time" });
    }

    const exists = await Appointment.findOne({ date, time });
    

    if (exists) {
      return res.status(409).json({ message: "Time slot already booked. Please select another time." });
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

     const normalizedDate = new Date(date).toISOString().split("T")[0];

    const today = new Date().toISOString().split("T")[0];
    if (normalizedDate < today) {
      return res.status(400).json({
        message: "You cannot book an appointment in the past",
      });
    }

    const existingAppointment = await Appointment.findOne({ date: normalizedDate, time });
    if (existingAppointment) {
      return res.status(409).json({ message: "This time slot is already booked." });
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


    const stillAvailable = await Appointment.findOne({ date: normalizedDate, time });
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
      date: normalizedDate,
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


exports.bookAdminAppointment = async (req, res) => {
  try {
    const {
      service,
      firstname,
      lastname,
      phone1,
      phone2,
      address,
      date,
      time,
      price,
    } = req.body;

    // ✅ Normalize date FIRST
    const normalizedDate = new Date(date).toISOString().split("T")[0];

    // ✅ Prevent past date booking
    const today = new Date().toISOString().split("T")[0];
    if (normalizedDate < today) {
      return res.status(400).json({
        message: "You cannot book an appointment in the past",
      });
    }

    // ✅ Prevent double booking (NOW RELIABLE)
    const existingAppointment = await Appointment.findOne({
      date: normalizedDate,
      time,
    });

    if (existingAppointment) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked." });
    }

    // ✅ Save normalized date
    const newAppointment = new Appointment({
      service,
      firstname,
      lastname,
      phone1,
      phone2,
      address,
      date: normalizedDate,
      time,
      price,
    });

    await newAppointment.save();

    return res.status(201).json({
      message: "Admin appointment booked successfully",
    });
  } catch (error) {
    console.error("Admin booking error:", error.message);
    return res.status(500).json({
      message: "Error booking admin appointment",
      error: error.message,
    });
  }
};


exports.getAdminAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      "service.name": "Admin",
      firstname: "Admin",
      lastname: "Admin",
      phone1: "Admin",
      phone2: "Admin",
      address: "Admin",
      price: 0,
    }).sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Admin appointments fetch error:", error.message);
    return res.status(500).json({
      message: "Error fetching admin appointments",
      error: error.message,
    });
  }
};


exports.deleteAdminAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.find({
      "service.name": "Admin",
      firstname: "Admin",
      lastname: "Admin",
      phone1: "Admin",
      phone2: "Admin",
      address: "Admin",
      price: 0,
    }).sort({ createdAt: -1 });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

   const deleted = await Appointment.findByIdAndDelete(id);

   if (deleted){
     return res.status(200).json({ message: "Admin appointment deleted successfully" });
   }
   
  } catch (error) {
    console.error("Admin appointment deletion error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Error deleting admin appointment",
      error: error.response?.data || error.message,
    });
  }
};

// exports.getSlots = async (req, res) => {
//   const { date } = req.query;

//   if (!date) return res.status(400).json({ error: "Date is required" });

 
//    const allSlots = [
//   { label: "7AM", value: "07:00" },
//   { label: "9AM", value: "09:00" },
//   { label: "11AM", value: "11:00" },
//   { label: "1PM", value: "13:00" },
//   { label: "3PM", value: "15:00" },
//   { label: "5PM", value: "17:00" },
//   { label: "7PM", value: "19:00" },
//   { label: "9PM", value: "21:00" },
// ];

//   const appointments = await Appointment.find({ date });
//   const bookedCount = appointments.length;
//   const totalSlots = 8;

//   const bookedTimes = appointments.map((a) => a.time);

//   const availableSlotTimes = allSlots?.label?.filter(slot => !bookedTimes.includes(slot));

//   const availableSlotsCount = totalSlots - bookedCount;

//   res.status(200).json({ availableSlots: availableSlotsCount, availableSlotTimes });
// };



exports.getUserAppointments = async (req, res) => {
  const  userId  = req.user.id;

  try {
    const appointments = await Appointment.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};


exports.getAllClientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $nor: [
        {
          "service.name": "Admin",
          firstname: "Admin",
          lastname: "Admin",
          phone1: "Admin",
          phone2: "Admin",
          address: "Admin",
          price: 0,
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Fetch client appointments error:", error.message);
    res.status(500).json({
      message: "Failed to fetch client appointments",
      error: error.message,
    });
  }
};


exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        message: "Date and time are required",
      });
    }

    // 1️⃣ Block editing Admin appointments
    const appointment = await Appointment.findOne({
      _id: id,
      $nor: [
        {
          "service.name": "Admin",
          firstname: "Admin",
          lastname: "Admin",
          phone1: "Admin",
          phone2: "Admin",
          address: "Admin",
          price: 0,
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or cannot be edited",
      });
    }

    // 2️⃣ Prevent double booking
    const conflict = await Appointment.findOne({
      _id: { $ne: id },
      date,
      time,
    });

    if (conflict) {
      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    // 3️⃣ Update date & time
    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Reschedule error:", error.message);
    res.status(500).json({
      message: "Failed to reschedule appointment",
      error: error.message,
    });
  }
};
