import express from "express";
import { getAdvancedAnalytics, getDashboardAnalytics  } from "../controllers/product/analytics.js";

const router = express.Router();

router.get("/", getDashboardAnalytics);
router.get("/advanced", getAdvancedAnalytics);

export default router;
