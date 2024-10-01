import Order from '../models/order.model.js'; // Import your Order model
import User from '../models/user.model.js';
import OrderDetail from '../models/orderDetail.model.js';


export const addOrder = async (req, res) => {
  const { user_id, shippingAddress, orderAddress, orderEmail, order_status, orderDetails } = req.body;

  try {
    // Create a new order
    const newOrder = new Order({
      user_id,
      shippingAddress,
      orderAddress,
      orderEmail,
      order_status,
    });

    const savedOrder = await newOrder.save();

    // Add order details if provided
    if (orderDetails && orderDetails.length > 0) {
      const orderDetailPromises = orderDetails.map(async (detail) => {
        const newOrderDetail = new OrderDetail({
          order_id: savedOrder._id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          price: detail.price,
        });
        const savedOrderDetail = await newOrderDetail.save();
        return savedOrderDetail._id; // Return the ID of the saved order detail
      });

      // Save all order details and update the order with their IDs
      const savedOrderDetailIds = await Promise.all(orderDetailPromises);
      savedOrder.orderDetails = savedOrderDetailIds;
      await savedOrder.save();
    }

    res.status(201).json({
      message: "Order successfully added",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Failed to add order" });
  }
};


// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user_id', 'email')  // Populate user info
      .populate({
        path: 'orderDetails',  // Populate order details
        populate: { path: 'product_id' },  // Nested populate for product info
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};



// Get a single order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('user_id', 'email');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { shippingAddress, orderAddress, orderEmail, order_status, orderDetails } = req.body;

  try {
    // Update order info
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { shippingAddress, orderAddress, orderEmail, order_status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order details
    if (orderDetails && orderDetails.length > 0) {
      // Delete old order details
      await OrderDetail.deleteMany({ order_id: updatedOrder._id });

      // Add new order details
      const orderDetailPromises = orderDetails.map((detail) => {
        const newOrderDetail = new OrderDetail({
          order_id: updatedOrder._id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          price: detail.price,
        });
        return newOrderDetail.save();
      });
      await Promise.all(orderDetailPromises);
    }

    res.status(200).json({
      message: "Order successfully updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};


export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Delete associated order details
    await OrderDetail.deleteMany({ order_id: deletedOrder._id });

    res.status(200).json({
      message: "Order and associated details successfully deleted",
      order: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};


