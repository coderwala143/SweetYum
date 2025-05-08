const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxLength: [100, "Product name must be less than 100 characters"],
    minLength: [2, "Product name must be at least 3 characters"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    maxLength: [1000, "Product description must be less than 200 characters"],
    minLength: [2, "Product description must be at least 3 characters"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be positive"],
  },
  category:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock must be positive"],
    default: 0,
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating"
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
