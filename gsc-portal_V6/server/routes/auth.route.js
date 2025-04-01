const express = require("express");
const { verifyGoogleToken } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/google", verifyGoogleToken);

module.exports = router;
