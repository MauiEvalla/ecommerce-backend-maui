import {addCategory,getAllCategories,updateCategory,deleteCategory,getCategoryById  } from "../controllers/category.controllers.js";
import express from "express";

const router = express.Router();


//Category
router.post("/addCategory",addCategory)
router.get("/getAllCategories",getAllCategories)
router.get("/getCategoryById/:id",getCategoryById)

router.put("/updateCategory/:id",updateCategory)
router.delete("/deteteCategory/:id",deleteCategory)



export default router;