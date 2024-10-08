// controllers/cart.controller.js
import Cart from '../models/cart.model.js'; // Import your Cart model
import Product from '../models/product.model.js'; 

// Add item to cart
export const addItemToCart = async (req, res) => {
  const userId = req.user._id; // middleware to get authenticated user
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user_id: userId });

    if (cart) {
      // If cart exists, check if item already exists
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // If item exists, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Else, add the new item
        cart.items.push({ productId, quantity });
      }
    } else {
      // If no cart, create a new one
      cart = new Cart({
        user_id: userId,
        items: [{ productId, quantity }],
      });
    }

    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// Get cart by user
export const getCartByUserId = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user_id: userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    await Cart.findOneAndDelete({ user_id: userId });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};

