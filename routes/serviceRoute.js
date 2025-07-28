const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const { addService, getServices } = require("../controllers/serviceController");

router.post("/addservice", upload.single("image"), addService);
router.get("/getservices", getServices);

module.exports = router;
