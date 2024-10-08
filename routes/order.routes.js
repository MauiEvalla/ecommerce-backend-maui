import express from "express";
import {addOrder,getAllOrders,getOrderById,updateOrder,deleteOrder,createOrderFromCart} from "../controllers/order.controllers.js";
import { protect } from '../middlewares/protect.js';


const router = express.Router();


router.post("/addOrder",protect,addOrder)

router.post("/OrderFromCart",protect,createOrderFromCart)

router.get("/",protect, getAllOrders);

router.get("/:id",protect,getOrderById)

router.put("/update/:id",protect,updateOrder)

router.delete("/delete/:id",protect,deleteOrder)


export default router;