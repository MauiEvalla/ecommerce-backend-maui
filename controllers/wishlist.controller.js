import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js"; // Import the User model


// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
      const userId = req.user._id; // Use the user ID from the token
      const { productId } = req.body;
  
      // Find the user's wishlist
      let wishlist = await Wishlist.findOne({ userId });
  
      if (!wishlist) {
        wishlist = new Wishlist({ userId, productIds: [productId] });
      } else {
        if (!wishlist.productIds.includes(productId)) {
          wishlist.productIds.push(productId);
        }
      }
  
      await wishlist.save();
      res.status(200).send({ message: "Product added to wishlist", wishlist });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).send({ message: "Wishlist not found" });
    }

    // Remove the product from the wishlist
    wishlist.productIds = wishlist.productIds.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    res.status(200).send({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get user's wishlist from token
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ userId }).populate("productIds");

    if (!wishlist) {
      return res.status(404).send({ message: "Wishlist not found" });
    }

    res.status(200).send({ wishlist });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


export { addToWishlist, removeFromWishlist, getWishlist };
