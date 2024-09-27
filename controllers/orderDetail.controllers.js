import OrderDetail from '../models/orderDetail.model.js';

// Create a new OrderDetail
export const addOrderDetail = async (req, res) => {
  try {
    const { order_id, product_id, quantity, price } = req.body; // Change variable names to match schema

    const newOrderDetail = new OrderDetail({ order_id, product_id, quantity, price }); // Use order_id and product_id
    const savedOrderDetail = await newOrderDetail.save();

    res.status(201).json({ message: "Order detail added successfully", orderDetail: savedOrderDetail });
  } catch (error) {
    res.status(400).json({ message: "Error adding order detail", error });
  }
};


// Get all OrderDetails
export const getOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetail.find().populate('orderId productId');
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details", error });
  }
};

// Get OrderDetail by ID
export const getOrderDetailById = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findById(req.params.id).populate('orderId productId');
    res.status(200).json(orderDetail);
  } catch (error) {
    res.status(404).json({ message: "Order detail not found", error });
  }
};

// Delete OrderDetail
export const deleteOrderDetail = async (req, res) => {
  try {
    await OrderDetail.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order detail deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting order detail", error });
  }
};

