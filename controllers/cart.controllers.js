import Cart from '../models/cart.model.js';

// Add item to Cart
export const addItemToCart = async (req, res) => {
  const { user_id, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user_id });
    
    if (cart) {
      // Check if product already exists in cart
      const productIndex = cart.items.findIndex(item => item.productId == productId);
      
      if (productIndex > -1) {
        // If product exists, update the quantity
        cart.items[productIndex].quantity += quantity;
      } else {
        // If product does not exist, add to cart
        cart.items.push({ productId, quantity });
      }
    } else {
      // If no cart, create a new cart
      const newCart = new Cart({
        user_id,
        items: [{ productId, quantity }],
      });
      await newCart.save();
    }
    
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error adding product to cart', error });
  }
};

// Get Cart by User ID
export const getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.params.userId }).populate('items.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: 'Cart not found', error });
  }
};

// Remove item from Cart
export const removeItemFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId != productId);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(400).json({ message: 'Error removing item from cart', error });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user_id: req.params.userId });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error clearing cart', error });
  }
};

export{addItemToCart,getCartByUserId,clearCart};
