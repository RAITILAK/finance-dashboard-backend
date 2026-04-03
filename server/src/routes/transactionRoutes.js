import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import protect from "../middleware/auth.js";
import roleGuard from "../middleware/roleGuard.js";

const router = express.Router();
router.use(protect);

router.get("/", getTransactions);
router.post("/", roleGuard("admin"), createTransaction);
router.put("/:id", roleGuard("admin"), updateTransaction);
router.delete("/:id", roleGuard("admin"), deleteTransaction);

export default router;
