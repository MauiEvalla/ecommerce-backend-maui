import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Merchant model
        ref: "users",
        required: true,
      },
    shippingAddress:{
        type:String,
        required:true
    },
    orderAddress:{
        type:String,
        required:true 
    },
    orderEmail:{
        type:String,
        required:true
    },
    order_status:{
        type:Boolean,
        required:true
    }
})

const Order = mongoose.model("Order", orderSchema);
export default Order;
