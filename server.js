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

app.use("/upload", express.static(path.join("public/upload")));


app.use(
  cors({
    origin: ["http://localhost:5173", "https://ashe-beauty.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/appointments", require("./routes/appointmentsRoute"));
app.use("/api/services", require("./routes/serviceRoute"));
app.use("/api/slot", require("./routes/appointmentsRoute"));
app.use("/api/appointments", require("./routes/appointmentsRoute"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log("DB Error:", err));
