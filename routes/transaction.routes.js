import * as transactions from "../controllers/transactionsHistory.controllers.js";
import { protect } from "../middlewares/protect.js";
import { Router } from "express";

const router = Router();

router.get(
  "/get-user-transactions",
  protect,
  transactions.getTransactionsByUserId
);

export default router;