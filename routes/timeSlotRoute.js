const express = require("express");
const router = express.Router();
const { getActiveTimeSlots } = require("../controllers/timeSlotController");
const { toggleTimeSlot } = require("../controllers/timeSlotController");
const { getAllTimeSlots } = require("../controllers/timeSlotController");

router.get("/active", getActiveTimeSlots);
router.get("/all", getAllTimeSlots);
router.patch("/:id/toggle", toggleTimeSlot);

module.exports = router;
