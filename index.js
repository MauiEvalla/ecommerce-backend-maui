import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
//Connection
import connectToMongoDB from "./database/connectToMongoDB.js";


//Product Routes
import productRoutes from "./routes/product.routes.js";

//Category Routes
import categoryRoutes from "./routes/category.routes.js";
import subcategoryRoutes from "./routes/subcategory.routes.js";
import orderRoutes from "./routes/order.routes.js";
import orderDetails from "./routes/orderDetail.routes.js";
import merchantRoutes from "./routes/merchant.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";


const app = express();
dotenv.config();

app.use(cors({
    origin: "https://ecommerce-frontend-seven-blush.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
  );

  app.use(morgan('dev')); // log requests and responses in dev format

app.use(express.json()); // to parse the incoming request with json payloads (From req.body)

const PORT = process.env.PORT || 8000;

//for testing
app.get("/",(req,res)=>{
    res.send("Hello Node JS!");
});

//For testing
app.listen(PORT,()=>{
    connectToMongoDB();
});

app.use("/api/product",productRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/subcategory",subcategoryRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/orderDetail",orderDetails);
app.use("/api/orderDetail",orderDetails);
app.use("/api/merchant/",merchantRoutes);
app.use("/api/user/",userRoutes);
app.use("/api/cart/",cartRoutes);