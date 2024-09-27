import express from "express";
import {addSubcategory,getSubcategories,getSubcategoryById,deleteSubcategory}from "../controllers/subcategory.controller.js";

const router = express.Router();


router.post("/addSubcategory",addSubcategory)

router.get("/subcategory", getSubcategories)

router.get("/subcategory/:id",getSubcategoryById)

router.delete("/delete/:id",deleteSubcategory)


export default router;