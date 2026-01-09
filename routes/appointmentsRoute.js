const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { bookAppointment } = require("../controllers/appointmentController");
const { checkAvailability } = require("../controllers/appointmentController");
const { getUserAppointments } = require("../controllers/appointmentController");
const { bookAdminAppointment } = require("../controllers/appointmentController");
const { deleteAdminAppointment } = require("../controllers/appointmentController");
const { getAdminAppointments } = require("../controllers/appointmentController");
const { getAllClientAppointments } = require("../controllers/appointmentController");
const { rescheduleAppointment } = require("../controllers/appointmentController");

router.get("/admin/all", getAllClientAppointments);
router.put("/admin/reschedule/:id", rescheduleAppointment);
router.post("/check-slot", auth, checkAvailability);
router.post("/book", auth, bookAppointment);
router.get("/user", auth, getUserAppointments);
router.post("/admin/book", bookAdminAppointment);
router.delete("/admin/:id/delete", deleteAdminAppointment);
router.get("/admin", getAdminAppointments);

module.exports = router;

