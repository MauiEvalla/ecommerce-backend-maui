import express from "express";
import {addOrderDetail,getOrderDetails,getOrderDetailById,deleteOrderDetail} from "../controllers/orderDetail.controllers.js";



const router = express.Router();

router.post("/addOrderDetail",addOrderDetail)

router.get("/getOrderDetails", getOrderDetails);

router.get("getOrderDetails/:id",getOrderDetailById)

router.delete("/delete/:id",deleteOrderDetail)




export default router;