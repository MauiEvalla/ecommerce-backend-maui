import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Merchant from "../models/merchant.model.js";

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Token missing from request");
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database (based on decoded token's userId)
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Attach the user to the request object for access in routes
    req.user = { _id: user._id, ...user._doc };

    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

const adminProtect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decodedToken.adminId);
    if (!admin) {
      throw new Error("Invalid token");
    }
    req.user = { adminId: admin._id };
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

const merchantProtect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const merchant = await Merchant.findById(decodedToken.merchantId);
    if (!merchant) {
      throw new Error("Invalid token");
    }
    req.user = { merchantId: merchant._id };
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

//CHANGED THE ORIGINAL
const protectByRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in the database based on the decoded token's userId
      const user = await User.findById(decodedToken.userId);
      if (!user || !allowedRoles.includes(user.role)) {
        throw new Error("You are not authorized to perform this action");
      }

      // Attach user to the request object for further access
      req.user = { _id: user._id, role: user.role, ...user._doc };

      next();
    } catch (error) {
      res.status(401).send({ message: error.message });
    }
  };
};


export { protect, protectByRole, adminProtect, merchantProtect };