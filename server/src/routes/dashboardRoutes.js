import express from "express";
import {
  getSummary,
  getByCategory,
  getTrends,
  getRecent,
} from "../controllers/dashboardController.js";
import protect from "../middleware/auth.js";
import roleGuard from "../middleware/roleGuard.js";

const router = express.Router();
router.use(protect);

router.get("/summary", roleGuard("admin", "analyst"), getSummary);
router.get("/by-category", roleGuard("admin", "analyst"), getByCategory);
router.get("/trends", roleGuard("admin", "analyst"), getTrends);
router.get("/recent", getRecent);

export default router;
