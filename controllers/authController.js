const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const fetch = require("node-fetch");
const { fetch } = require('undici');
require("dotenv").config();



// exports.signup = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userExist = await User.findOne({ email });
//     if (userExist) return res.status(400).json({ message: "Email already exists" });

//      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//      if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//       message:
//         "Password must be at least 8 characters long and contain both letters and numbers.",
//     });
//   }
//     const hashed = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ email, password: hashed });

//     res.status(201).json({ message: "Signup successful"});
//   } catch (err) {
//     res.status(500).json({ message: "Signup failed", error: err.message });
//   }
// };

const allowedStates = ["Ondo", "Ekiti", "Osun", "Oyo", "Kogi", "Edo", "Ogun", "Delta", "Lagos"];


exports.signup = async (req, res) => {
  const { email, password, coords } = req.body;

  if (!coords || !coords.latitude || !coords.longitude) {
    return res.status(400).json({ message: "Location access is required to sign up." });
  }

  try {
  
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
      {
        headers: {
          "User-Agent": process.env.USER_AGENT,
        },
      }
    );

    const geoData = await geoRes.json();
    const state = geoData?.address?.state || geoData?.address?.region;

    if (!state) {
      return res.status(400).json({ message: "Could not determine your state." });
    }

    if (!allowedStates.includes(state)) {
      return res.status(403).json({ message: `Sorry, this service is not available at your location.` });
    }

  
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

   
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain both letters and numbers.",
      });
    }

    // 5. Hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashed });

    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};



exports.login = async (req, res) => {
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
