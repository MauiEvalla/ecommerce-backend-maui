import Order from '../models/order.model.js'; // Import your Order model

// Add a new order
export const addOrder = async (req, res) => {
  const { user_id, shippingAddress, orderAddress, orderEmail, order_status } = req.body;

  try {
    const newOrder = new Order({
      user_id,
      shippingAddress,
      orderAddress,
      orderEmail,
      order_status,
    });

    const savedOrder = await newOrder.save();

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
    const orders = await Order.find().populate('user_id', 'email'); // Populating the user info (e.g., email)
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
  const { amount, shippingAddress, orderAddress, orderEmail, orderDate, order_status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { amount, shippingAddress, orderAddress, orderEmail, orderDate, order_status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
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

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order successfully deleted",
      order: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

