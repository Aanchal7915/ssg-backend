import express from "express";
import { getAdvancedAnalytics } from "../controllers/product/analytics.js";

const router = express.Router();

// GET /api/analytics
router.get("/", getAdvancedAnalytics);

export default router;
