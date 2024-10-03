import express from "express";
import {addOrderDetail,getOrderDetails,getOrderDetailById,deleteOrderDetail} from "../controllers/orderDetail.controllers.js";
import { protect } from '../middlewares/protect.js';



const router = express.Router();

router.post("/addOrderDetail",protect,addOrderDetail)

router.get("/getOrderDetails", getOrderDetails);

router.get("/getOrderDetails/:id",getOrderDetailById)

router.delete("/delete/:id",deleteOrderDetail)




export default router;