const express = require("express");
const router = express.Router();
// const auth = require("../middleware/authMiddleware");
const { bookAppointment } = require("../controllers/appointmentController");
const { checkAvailability } = require("../controllers/appointmentController");
// const { getUserAppointments } = require("../controllers/appointmentController");
const { bookAdminAppointment } = require("../controllers/appointmentController");
const { deleteAdminAppointment } = require("../controllers/appointmentController");
const { getAdminAppointments } = require("../controllers/appointmentController");
const { getAllClientAppointments } = require("../controllers/appointmentController");
const { rescheduleAppointment } = require("../controllers/appointmentController");
const { controllerLimiter } = require("../middleware/rateLimiter");

router.get("/admin/all", controllerLimiter, getAllClientAppointments);
router.put("/admin/reschedule/:id", controllerLimiter, rescheduleAppointment);
router.post("/check-slot", controllerLimiter, checkAvailability);
router.post("/book", controllerLimiter, bookAppointment);
// router.get("/user", getUserAppointments);
router.post("/admin/book", bookAdminAppointment);
router.delete("/admin/:id/delete", deleteAdminAppointment);
router.get("/admin", getAdminAppointments);

module.exports = router;

