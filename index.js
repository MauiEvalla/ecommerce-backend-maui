import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
//Connection

import { connectToMongoDB } from "./config/connectToMongoDB.js";

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
import reviewRoutes from "./routes/review.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import transactionRoutes from "./routes/transaction.routes.js"


const app = express();
dotenv.config();

app.use(
  cors({
    origin: "https://ecommerce-frontend-seven-blond.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev")); // log requests and responses in dev format

app.use(express.json()); // to parse the incoming request with json payloads (From req.body)

const PORT = process.env.PORT || 5000;

//for testing
app.get("/", (req, res) => {
  res.send("Hello Node JS!");
});

//For testing
// app.listen(PORT, () => {
//   connectToMongoDB();
// });

const startServer = () => {
  try {
    connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();

app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orderDetail", orderDetails);
app.use("/api/merchant/", merchantRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/cart/", cartRoutes);
app.use("/api/reviews/",reviewRoutes)
app.use("/api/wishlist", wishlistRoutes); 
app.use("/api/transactions", transactionRoutes);


