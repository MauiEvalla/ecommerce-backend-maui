import express from "express";
import {addOrder,getAllOrders,getOrderById,updateOrder,deleteOrder} from "../controllers/order.controllers.js";

const router = express.Router();


router.post("/addOrder",addOrder)

router.get("/order", getAllOrders);

router.get("/order/:id",getOrderById)

router.put("/update/:id",updateOrder)

router.delete("/delete/:id",deleteOrder)


export default router;