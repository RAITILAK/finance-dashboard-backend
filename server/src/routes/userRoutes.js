import express from "express";
import {
  getAllUsers,
  updateRole,
  updateStatus,
} from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import roleGuard from "../middleware/roleGuard.js";

const router = express.Router();
router.use(protect, roleGuard("admin"));

router.get("/", getAllUsers);
router.patch("/:id/role", updateRole);
router.patch("/:id/status", updateStatus);

export default router;
