const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const { addService, getServices, editService, deleteService  } = require("../controllers/serviceController");
const auth = require("../middleware/authMiddleware");

router.post("/addservice", upload.single("image"), addService);
router.get("/getservices", getServices);
router.get("/getservices/admin", getServices);
router.put("/editservice/:id", upload.single("image"), editService);
router.delete("/deleteservice/:id", deleteService);

module.exports = router;
