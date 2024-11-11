import express from "express";
import {addToWishlist,removeFromWishlist,getWishlist} from "../controllers/wishlist.controller.js";
import { protect } from "../middlewares/protect.js"; // Import your protect middleware


const router = express.Router();

// Add a product to the wishlist
router.post("/add",protect, addToWishlist);

// Remove a product from the wishlist
router.post("/remove",protect, removeFromWishlist);

// Get the wishlist for a user
router.get("/", protect, getWishlist);

export default router;