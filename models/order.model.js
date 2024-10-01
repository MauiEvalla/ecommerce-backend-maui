import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "User",
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  orderAddress: {
    type: String,
    required: true,
  },
  orderEmail: {
    type: String,
    required: true,
  },
  order_status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  // Add a reference to orderDetails
  orderDetails: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderDetail", // Reference to the OrderDetail model
  }]
}, {
  timestamps: true, // Add createdAt and updatedAt fields automatically
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
