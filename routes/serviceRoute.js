const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const { addService, getServices } = require("../controllers/serviceController");
const auth = require("../middleware/authMiddleware");

router.post("/addservice", upload.single("image"), addService);
router.get("/getservices", auth, getServices);
router.get("/getservices/admin", getServices);

module.exports = router;
