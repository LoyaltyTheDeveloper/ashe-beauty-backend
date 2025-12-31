const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const fetch = require("node-fetch");
const { fetch } = require('undici');
require("dotenv").config();
// import crypto from "crypto";
const crypto = require("crypto");
const nodemailer = require("nodemailer");



exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "Email already exists" });

     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
     if (!passwordRegex.test(password)) {
      return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain both letters and numbers.",
    });
  }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashed });

    res.status(201).json({ message: "Signup successful. Please log in." });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// const allowedStates = ["Ondo", "Ekiti", "Osun", "Oyo", "Kogi", "Edo", "Ogun", "Delta", "Lagos"];


// exports.signup = async (req, res) => {
//   const { email, password, coords } = req.body;

//   if (!coords || !coords.latitude || !coords.longitude) {
//     return res.status(400).json({ message: "Location access is required to sign up." });
//   }

//   try {
  
//     const geoRes = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
//       {
//         headers: {
//           "User-Agent": process.env.USER_AGENT,
//         },
//       }
//     );

//     const geoData = await geoRes.json();
//     const state = geoData?.address?.state || geoData?.address?.region;

//     if (!state) {
//       return res.status(400).json({ message: "Could not determine your state." });
//     }

//     if (!allowedStates.includes(state)) {
//       return res.status(403).json({ message: `Sorry, this service is not available at your location.` });
//     }

  
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

   
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must be at least 8 characters long and contain both letters and numbers.",
//       });
//     }

//     // 5. Hash password and create user
//     const hashed = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ email, password: hashed });

//     res.status(201).json({ message: "Signup successful" });

//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: "Signup failed", error: err.message });
//   }
// };



exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

     res.status(200).json({
      message: "Login successful",
      token
    });
    
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const token = crypto.randomBytes(32).toString("hex");

//   user.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");

//   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

//   await user.save();

//   const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

//   await sendEmail({
//     to: user.email,
//     subject: "Reset your password",
//     html: `
//       <p>You requested a password reset.</p>
//       <a href="${resetLink}">Reset Password</a>
//       <p>This link expires in 15 minutes.</p>
//     `
//   });

//   res.status(200).json({ message: "Reset link sent to email" });
// };





exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // host: "smtp.gmail.com",
      // port: 587,
      // secure: false,
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },

    });

    transporter.verify((err, success) => {
      if (err) {
        console.error("SMTP VERIFY ERROR:", err);
      } else {
        console.log("SMTP SERVER READY");
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"Ashe Beauty" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
     <div style="
  max-width: 520px;
  margin: 0 auto;
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #FFF7F4;
  padding: 30px;
  border-radius: 14px;
">

  <!-- Header -->
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="
      margin: 0;
      color: #3A2A25;
      font-size: 26px;
      font-weight: 700;
    ">
      Password Reset
    </h2>
    <p style="
      margin-top: 8px;
      color: #7A5C52;
      font-size: 14px;
    ">
      Secure access to your account
    </p>
  </div>

  <!-- Card -->
  <div style="
    background-color: #FFFFFF;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  ">
    <p style="
      color: #4A3A35;
      font-size: 15px;
      line-height: 1.6;
      margin-top: 0;
    ">
      You requested a password reset for your account. Click the button below
      to set a new password.
    </p>

    <!-- Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="
        display: inline-block;
        padding: 14px 26px;
        background-color: #DA9F87;
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 600;
        border-radius: 30px;
        text-decoration: none;
        box-shadow: 0 8px 18px rgba(218,159,135,0.45);
      ">
        Reset Password
      </a>
    </div>

    <p style="
      color: #6B4F45;
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 0;
    ">
      ⏳ This link will expire in <strong>15 minutes</strong>.
    </p>
  </div>

  <!-- Footer -->
  <p style="
    margin-top: 25px;
    text-align: center;
    font-size: 12px;
    color: #8A6E63;
    line-height: 1.5;
  ">
    If you didn’t request this password reset, you can safely ignore this email.
    <br />
    Your account remains secure.
  </p>

</div>
      `,
    });

    res.status(200).json({ message: "The reset link has been sent to your email. Please check your spam folder if you don't see it in your inbox." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while sending the reset link." });
  }
};








exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Your password has been reset successfully." });
};

console.log("ENV CHECK:", {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS ? "SET" : "MISSING",
  CLIENT_URL: process.env.CLIENT_URL,
});
