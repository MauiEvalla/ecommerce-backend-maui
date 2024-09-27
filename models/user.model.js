import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/duhaupnxy/image/upload/v1712134056/samples/balloons.jpg",
    },
    isActive: { type: Boolean, default: true },
    role: { type: String, required: true, default: "user" },
    firstName: { type: String, required: true },
    middleName: { type: String, default: null },
    lastName: { type: String, required: true },
    mobileNo: { type: String, required: true, unique: true },
    birthdate: { type: Date },
    gender: { type: String, default: "" },
    fullAddress: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      province: { type: String, default: "" },
      country: { type: String, default: "Philippines" },
      postalCode: { type: String, default: "" },
    },

    verification: {
      isVerified: { type: Boolean, required: true, default: false },
      verificationCode: { type: String },
      verifiedAt: { type: Date },
      note: { type: String },
      validId: {
        type: String,
        default: "",
      },
      selfiePicture: {
        type: String,
        default: "",
      },
      status: { type: String, required: true, default: "new" },
      validatedBy: { type: String },
    },

    qrCode: { type: String },
    secretCode: { type: String, required: true },
    isFirstTimeLogin: { type: Boolean, default: true },

    creditRequests: [
      {
        merchantId: { type: String, required: true },
        merchantName: { type: String, required: true },
        isApproved: { type: Boolean, required: true, default: false },
        incomeSource: { type: String },
        incomeSourceAmount: { type: String },
        creditAmount: { type: Number, required: true, default: 0 },
        applicationDate: { type: Date, required: true, default: null },
        term: { type: String },
        status: { type: String, required: true, default: "new" },
        dateApproved: { type: Date },
      },
    ],

    credits: [
      {
        merchantId: { type: String, required: true },
        merchantName: { type: String, required: true },
        isApproved: { type: Boolean, required: true, default: false },
        incomeSource: { type: String },
        incomeSourceAmount: { type: String },
        creditAmount: { type: Number, required: true, default: 0 },
        applicationDate: { type: Date, required: true, default: null },
        term: { type: String },
        status: { type: String, required: true },
        dateApproved: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;