import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Merchant model
        ref: "order",
        required: true,
      },
      product_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Merchant model
        ref: "product",
        required: true,
      },
    price:{
        type:Number,
        required:true 
    },
    quantity:{
        type:Number,
        required:true
    }
})
1
const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);
export default OrderDetail;
