import express from "express";
import {addProduct,getAllProduct,getAllProductID,updateProduct,deleteProduct} from "../controllers/product.controllers.js";



const router = express.Router();

router.post("/addProduct",addProduct)

router.get("/Products", getAllProduct);

router.get("/:id",getAllProductID)

router.put("/update/:id",updateProduct)

router.delete("/delete/:id",deleteProduct)




export default router;