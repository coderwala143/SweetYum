const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Order Address Required"],
      },
      city: {
        type: String,
        required: [true, "City Required"],
      },
      state: {
        type: String,
        required: [true, "State Required"],
      },
      pincode: {
        type: Number,
        required: [true, "Pincode Is Required For Order"],
      },
      phoneNo: {
        type: String,
        required: [true, "Phone Number Required"],
      },
    },
    paymentInfo: {
      paymentMethods: {
        type: String,
        enum: ["COD", "UPI", "Card"],
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["paid", "pending"],
        default: "pending",
      },
      transactionId: {
        type: String,
      },
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
