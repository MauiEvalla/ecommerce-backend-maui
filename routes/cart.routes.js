import express from "express";
import { getCartByUserId, addItemToCart, clearCart, removeItemFromCart } from "../controllers/cart.controllers.js";
import { protect } from "../middlewares/protect.js"; 

//MISSING TOKEN PROBLEM

const router = express.Router();

router.post("/addItemToCart", protect, addItemToCart);
router.get("/cart", protect, getCartByUserId);
router.post("/removeItemFromCart", protect, removeItemFromCart);
router.post("/clearCart", protect, clearCart);

export default router;
