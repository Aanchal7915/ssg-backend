import express from "express";
import { getDashboardAnalytics } from "../controllers/product/analytics.js";

const router = express.Router();

// GET /api/analytics
router.get("/", getDashboardAnalytics);

export default router;
