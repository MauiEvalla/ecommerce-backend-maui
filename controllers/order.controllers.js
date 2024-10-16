import Order from '../models/order.model.js'; // Import your Order model
import User from '../models/user.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import Cart from '../models/cart.model.js';



export const addOrder = async (req, res) => {
  const { shippingAddress, orderAddress, orderEmail, order_status, orderDetails } = req.body;
  const user_id = req.user._id; // Get the authenticated user ID

  try {
    // Create a new order
    const newOrder = new Order({
      user_id, // Use authenticated user's ID
      shippingAddress,
      orderAddress,
      orderEmail,
      order_status,
    });

    const savedOrder = await newOrder.save();

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
  const user_id = req.user._id; // Get authenticated user's ID

  try {
    const orders = await Order.find({ user_id }) // Get orders only for the authenticated user
      .populate('user_id', 'email') // Populate user info
      .populate({
        path: 'orderDetails', // Populate order details
        populate: { path: 'product_id' }, // Nested populate for product info
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
  const user_id = req.user._id; // Get authenticated user's ID

  try {
    const order = await Order.findOne({ _id: id, user_id }).populate('user_id', 'email'); // Find order only if it belongs to the user

    if (!order) {
      return res.status(404).json({ message: "Order not found or you don't have permission to access this order" });
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
  const user_id = req.user._id; // Get authenticated user's ID

  try {
    // Update order info if it belongs to the authenticated user
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, user_id }, // Find order only if it belongs to the user
      { shippingAddress, orderAddress, orderEmail, order_status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found or you don't have permission to update this order" });
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
  const user_id = req.user._id; // Get authenticated user's ID

  try {
    // Delete order only if it belongs to the authenticated user
    const deletedOrder = await Order.findOneAndDelete({ _id: id, user_id });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found or you don't have permission to delete this order" });
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

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params; // Order ID
  const { order_status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.order_status = order_status;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

export const createOrderFromCart = async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID from the token
  const { shippingAddress, orderAddress, orderEmail } = req.body; // Accept these fields from the request body

  try {
    // Fetch user's cart
    const cart = await Cart.findOne({ user_id: userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Calculate the total amount
    const totalAmount = cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    // Create a new order without orderDetails first
    const newOrder = new Order({
      user_id: userId,
      totalAmount,
      shippingAddress,
      orderAddress,
      orderEmail,
      order_status: 'pending', // Ensure lowercase to match the schema
    });

    const savedOrder = await newOrder.save();

    // Map cart items to match the structure of order details and include order_id
    const orderDetails = await Promise.all(
      cart.items.map(async (item) => {
        const orderDetail = new OrderDetail({
          order_id: savedOrder._id, // Use the newly created order's ID
          product_id: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        });
        await orderDetail.save();
        return orderDetail._id; // Store the ID of the saved OrderDetail
      })
    );

    // Update the saved order with the order details
    savedOrder.orderDetails = orderDetails;
    await savedOrder.save();

    // Clear the user's cart after the order is placed
    await Cart.findOneAndDelete({ user_id: userId });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order from cart:', error);
    res.status(500).json({ message: 'Failed to create order from cart' });
  }
};
