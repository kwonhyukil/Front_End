import express from "express";
import googleCalendarController from "../controllers/googleCalendarController.js";

const router = express.Router();

router.get("/google/callback", googleCalendarController.getCalendarEvents);

export default router;
