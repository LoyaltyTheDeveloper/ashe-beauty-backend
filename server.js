const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/", express.static("public/uploads"));

// app.use("/upload", express.static(path.join("public/upload")));
app.use("/upload", express.static("public/upload"));

const TimeSlot = require("./models/TimeSlot");
// const Policy = require("./models/Policy");


app.use(
  cors({
    origin: ["http://localhost:5173", "https://ashe-beauty.vercel.app", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/appointments", require("./routes/appointmentsRoute"));
app.use("/api/services", require("./routes/serviceRoute"));
app.use("/api/slot", require("./routes/appointmentsRoute"));
app.use("/api/timeslots", require("./routes/timeSlotRoute"));
app.use("/api/appointments", require("./routes/appointmentsRoute"));
app.use("/api/policies", require("./routes/policyRoute"));


// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    //  seedTimeSlots();
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log("DB Error:", err));

// const policies = [
//   {
//     title: "Booking Fee",
//     description:
//       "A non-refundable ₦5,000 fee is required to secure your date. No booking fee = No reservation."
//   },
//   {
//     title: "Rescheduling",
//     description:
//       "Rescheduling can be done 48 hours before your appointment."
//   },
//   {
//     title: "Travel Glam",
//     description:
//       "Home service outside Akure attracts a location-based travel fee. You can contact us via WhatsApp on 07061501897 for further information."
//   },
//   {
//     title: "Late Policy",
//     description:
//       "10–15 minutes grace. After that, an additional fee or cancellation may apply."
//   }
// ];


// const seedPolicies = async () => {
//   try {
//     await Policy.deleteMany(); // optional
//     await Policy.insertMany(policies);

//     console.log("Policies inserted successfully");
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedPolicies();


//   async function seedTimeSlots() {
//   try {
//     await TimeSlot.insertMany([
//       { label: "9:00 AM", value: "09:00" },
//       { label: "9:30 AM", value: "09:30" },
//       { label: "10:00 AM", value: "10:00" },
//       { label: "10:30 AM", value: "10:30" },
//       { label: "11:00 AM", value: "11:00" },
//       { label: "11:30 AM", value: "11:30" },
//       { label: "12:00 PM", value: "12:00" },
//       { label: "12:30 PM", value: "12:30" },
//       { label: "1:00 PM", value: "13:00" },
//       { label: "1:30 PM", value: "13:30" },
//       { label: "2:00 PM", value: "14:00" },
//       { label: "2:30 PM", value: "14:30" },
//       { label: "3:00 PM", value: "15:00" },
//       { label: "3:30 PM", value: "15:30" },
//       { label: "4:00 PM", value: "16:00" },
//       { label: "4:30 PM", value: "16:30" },
//       { label: "5:00 PM", value: "17:00" },
//       { label: "5:30 PM", value: "17:30" },
//       { label: "6:00 PM", value: "18:00" },
//       { label: "6:30 PM", value: "18:30" },
//       { label: "7:00 PM", value: "19:00" },
//       { label: "7:30 PM", value: "19:30" },
//       { label: "8:00 PM", value: "20:00" },
//       { label: "8:30 PM", value: "20:30" },
//       { label: "9:00 PM", value: "21:00" }
//     ]);
//     console.log('Time slots inserted successfully');
//   } catch (err) {
//     console.error('Error inserting time slots:', err);
//   }
// }

