const Product = require("../models/products.models");
const Order = require("../models/order.models");
const Users = require("../models/users.models");
const Cart = require("../models/cart.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports.placeOrder = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  const { shippingInfo, paymentInfo, quantity } = req.body;

  const user = await Users.findById(userId);
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not Found!");
  }

  const order = new Order({
    userId,
    products: [],
    shippingInfo: {
      address: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      pincode: shippingInfo.pincode,
      phoneNo: shippingInfo.phoneNo,
    },
    paymentInfo: {
      paymentMethods: paymentInfo.paymentMethods,
      paymentStatus: paymentInfo.paymentStatus,
      transactionId: paymentInfo.transactionId,
    },
    totalPrice: 0,
    totalItems: 0,
  });

  order.products.push({
    productId,
    quantity: quantity,
    priceAtPurchase: product.price,
  });

  order.totalItems = order.products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  order.totalPrice = order.products.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  await order.save().then(async () => {
    product.stock -= quantity;
    await product.save();
  });
  user.orders.push(order._id);
  await user.save();
  res
    .status(201)
    .json(new ApiResponse(200, order, "Order Placed Successfully"));
});

module.exports.multipleOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { shippingInfo, paymentInfo } = req.body;
  if (shippingInfo === "" || paymentInfo === "") {
    throw new ApiError(400, "All field required");
  }
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  const user = await Users.findById(userId);

  console.log(cart);
  if (!user) {
    throw new ApiError(404, "User Not Found!");
  }
  if (!cart) {
    throw new ApiError(404, "Cart Not Found!");
  }

  const order = new Order({
    userId,
    products: [],
    shippingInfo: {
      address: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      pincode: shippingInfo.pincode,
      phoneNo: shippingInfo.phoneNo,
    },
    paymentInfo: {
      paymentMethods: paymentInfo.paymentMethods,
      paymentStatus: paymentInfo.paymentStatus,
      transactionId: paymentInfo.transactionId,
    },
    totalPrice: 0,
    totalItems: 0,
  });
  cart.products.forEach(async (item) => {
    item.productId.stock -= item.quantity;
    if (item.productId.stock < 0) {
      item.productId.stock = 0;
    }
    await item.productId.save();
  });
  order.products.push(...cart.products);
  order.totalPrice = cart.totalPrice;
  order.totalItems = cart.totalItems;

  await order.save().then(async () => {
    await Cart.deleteOne({ userId });
    user.orders.push(order._id);
    await user.save();
  });
  res
    .status(201)
    .json(new ApiResponse(200, order, "Order Placed Successfully!"));
});
