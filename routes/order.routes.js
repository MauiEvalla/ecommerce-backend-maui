import express from "express";
import {addOrder,getAllOrders,getOrderById,updateOrder,deleteOrder} from "../controllers/order.controllers.js";

const router = express.Router();


router.post("/addOrder",addOrder)

router.get("/", getAllOrders);

router.get("/:id",getOrderById)

router.put("/update/:id",updateOrder)

router.delete("/delete/:id",deleteOrder)


export default router;