import Merchant from "../models/merchant.model.js";
import User from "../models/user.model.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
// import { cloudinary } from "../config/cloudinary.js";
import crypto from "crypto";

function generateUniqueCode() {
  let code = "";

  while (code.length < 6) {
    const randomDigit = crypto.randomInt(0, 10); // Generate a random number between 0 and 9
    if (!code.includes(randomDigit.toString())) {
      code += randomDigit;
    }
  }

  return code;
}

const createMerchant = async (req, res) => {
  try {
    const {
      email,
      mobileNo,
      password,
      storeName,
      firstName,
      middleName,
      lastName,
      officeAddress,
      shopAddress,
    } = req.body;
    if (
      !email ||
      !mobileNo ||
      !password ||
      !storeName ||
      !firstName ||
      !lastName ||
      !officeAddress ||
      !shopAddress
    ) {
      throw new Error("This fields are required");
    }

    const existingMerchantStoreName = await Merchant.findOne({ storeName });
    const existingMerchantEmail = await Merchant.findOne({ email });
    const existingUserEmail = await User.findOne({ email });
    const existingMerchantMobile = await Merchant.findOne({ mobileNo });
    const existingUserMobile = await User.findOne({ mobileNo });

    if (existingMerchantStoreName) {
      throw new Error("This trade name already exist");
    }

    if (existingMerchantEmail || existingUserEmail) {
      throw new Error("Email already exist");
    }

    if (existingMerchantMobile || existingUserMobile) {
      throw new Error("Mobile number already exist");
    }

    const hashedPassword = await hash(password, 10);
    const newMerchant = new Merchant({
      email,
      mobileNo,
      password: hashedPassword,
      storeName,
      firstName,
      middleName,
      lastName,
      officeAddress,
      shopAddress,
      secretCode: generateUniqueCode(),
    });

    newMerchant.save();
    res.status(200).send({ message: "Merchant account successfully created!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// const firstTimeLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const merchant = await Merchant.findOne({ email });

//     if (!merchant) {
//       throw new Error("Email doesn't match in our records");
//     }

//     // comparing user password
//     const isMatch = await compare(password, merchant.password);
//     if (!isMatch) {
//       throw new Error("Password is not correct");
//     }

//     const token = jwt.sign(
//       {
//         merchantId: merchant._id,
//         email: merchant.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "30d" }
//     );

//     merchant.isFirstTimeLogin = false;
//     merchant.save();

//     const userCode = merchant.secretCode;

//     res.status(200).send({
//       token,
//       merchantId: merchant._id,
//       userCode,
//     });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

const loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const merchant = await Merchant.findOne({ email });

    if (!merchant) {
      throw new Error("Email doesn't match in our records");
    }

    const isMatch = await compare(password, merchant.password);
    if (!isMatch) {
      throw new Error("Password is not correct");
    }

    if (!merchant.isFirstTimeLogin) {
      const token = jwt.sign(
        {
          merchantId: merchant._id,
          email: merchant.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.status(200).send({
        token,
        merchantId: merchant._id,
      });
    } else {
      const token = jwt.sign(
        {
          merchantId: merchant._id,
          email: merchant.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      merchant.isFirstTimeLogin = false;
      merchant.save();
      const merchantCode = merchant.secretCode;

      res.status(200).send({
        token,
        merchantId: merchant._id,
        merchantCode,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getAllMerchant = async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.status(200).send({ merchants: merchants });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getAllMerchantID = async (req, res) => {
  try {
    const { id } = req.params;
    const merchants = await Merchant.findById(id);

    res.status(200).json(merchants);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getAllBorrowerRequests = async (req, res) => {
  try {
    const { merchantId } = req.user;
    const user = await Merchant.findById(merchantId);

    res.status(200).send({ borrowersRequest: user.borrowerRequests });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getBorrowerRequestsById = async (req, res) => {
  try {
    const { merchantId } = req.user;
    const { id } = req.params;
    const merchant = await Merchant.findById(merchantId).populate({
      path: "borrowerRequests.userId",
    });

    const requests = merchant.borrowerRequests || [];

    const pendingRequest = requests.filter(
      // (request) => request.userId === id && request.status === "approved"
      (request) => request.userId === id
    );

    if (pendingRequest.length === 0) {
      throw new Error("No records found");
    }

    res.status(200).send({ borrowersRequest: pendingRequest });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  createMerchant,
  loginMerchant,
  getAllMerchant,
  getAllMerchantID,
  getAllBorrowerRequests,
  getBorrowerRequestsById,
};
