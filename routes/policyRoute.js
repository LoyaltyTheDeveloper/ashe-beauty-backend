const express = require("express");
const router = express.Router();
const { getPolicies, updatePolicy } = require("../controllers/policyController");
const { controllerLimiter } = require("../middleware/rateLimiter");


router.get("/get-policies", controllerLimiter, getPolicies);
router.put("/edit-policies/:id", controllerLimiter, updatePolicy);

module.exports = router;