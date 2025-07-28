const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { bookAppointment } = require("../controllers/appointmentController");
const { getSlots } = require("../controllers/appointmentController");
const { checkAvailability } = require("../controllers/appointmentController");
const { getUserAppointments } = require("../controllers/appointmentController");

router.post("/check-slot", auth, checkAvailability);
router.post("/book", auth, bookAppointment);
router.get("/slots", getSlots);
router.get("/user", auth, getUserAppointments);

module.exports = router;
