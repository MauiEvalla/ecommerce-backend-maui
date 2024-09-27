import express from "express";
import {getAllBorrowerRequests, getAllMerchant, loginMerchant,getAllMerchantID } from "../controllers/merchant.controllers.js";

const router = express.Router();

router.get("/merchants", getAllMerchant);      // Get all merchants
router.get("/merchants/:id", getAllMerchantID);  // Get merchant by ID

export default router;
