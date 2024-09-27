import express from "express";
import dotenv from "dotenv";


//Product Routes
import productRoutes from "./routes/product.routes.js";

//Category Routes
import categoryRoutes from "./routes/category.routes.js";

import subcategoryRoutes from "./routes/subcategory.routes.js";

import orderRoutes from "./routes/order.routes.js";

import orderDetails from "./routes/orderDetail.routes.js";

import merchantRoutes from "./routes/merchant.routes.js"

//Connection
import connectToMongoDB from "./database/connectToMongoDB.js";

const app = express();
dotenv.config();

app.use(express.json()); // to parse the incoming request with json payloads (From req.body)

const PORT = process.env.PORT || 8000;

app.use("/api/product",productRoutes); // http:localhost:8000/api/product/
app.use("/api/category",categoryRoutes);
app.use("/api/subcategory",subcategoryRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/orderDetail",orderDetails);
app.use("/api/orderDetail",orderDetails);
app.use("/api/merchant/",merchantRoutes);




//for testing
app.get("/",(req,res)=>{
    res.send("Hello Node JS!");
});

//For testing
app.listen(PORT,()=>{
    connectToMongoDB();
});