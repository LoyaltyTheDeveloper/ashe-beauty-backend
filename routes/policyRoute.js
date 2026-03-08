const express = require("express");
const router = express.Router();
const { getPolicies, updatePolicy } = require("../controllers/policyController");


router.get("/get-policies", getPolicies);
router.put("/edit-policies/:id", updatePolicy);

module.exports = router;