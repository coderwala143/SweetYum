const Cart = require("../models/cart.models");
const Product = require("../models/products.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports.addProductInCart = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  const product = await Product.findById(productId)
    .populate("category")
    .populate("reviews");
  if (!product) {
    throw new ApiError(404, "Product Not Found!");
  }

  // finding the current User Cart
  let cart = await Cart.findOne({ userId });

  //Checking if cart is empty
  if (!cart) {
    cart = new Cart({ userId, products: [], totalItems: 0, totalPrice: 0 }); // if cart is empty then created the new cart
  }
  const productInCart = cart.products.find((item) =>
    item.productId.equals(productId)
  ); // checking product is already in cart

  //if yes then just increasing the quantity
  if (productInCart) {
    productInCart.quantity += 1;
  }

  // if not then pushed product in cart
  else {
    cart.products.push({
      productId,
      quantity: 1,
      priceAtPurchase: product.price,
    });
  }
  //calculating total Items
  cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
  //calculating total Price
  cart.totalPrice = cart.products.reduce(
    (sum, p) => sum + p.priceAtPurchase * p.quantity,
    0
  );

  await cart.save().then(async () => {
    await product.save();
  }); //saved the cart so it will change in database
  res
    .status(200)
    .json(new ApiResponse(200, cart, "Product Added To Cart Successfully"));
});

module.exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate(
    "products.productId"
  );
  if (!cart) {
    throw new ApiError(404, "Cart Not Found!");
  }

  cart.products = cart.products.filter((item) => item.productId !== null); // filtering only the product is Not deleted

  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  ); // updating total price
  cart.totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0); // updating total items

  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, "All Cart"));
});

module.exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart Not Found!");
  }
  let isProductInCart = cart.products.some((item) =>
    item.productId.equals(productId)
  );
  if (!isProductInCart) {
    throw new ApiError(404, "Product not found in cart!");
  }
  cart.products = cart.products.filter(
    (item) => !item.productId.equals(productId)
  );
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  cart.totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
  await cart.save();
  res.status(200).json(new ApiResponse(200, null, "Product removed from cart"));
});

module.exports.increaseQuantity = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart Not Found!");
  }
  let product = cart.products.find((item) => item.productId.equals(productId));
  if (!product) {
    throw new ApiError(404, "Product not found in cart!");
  }

  product.quantity += 1;

  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  cart.totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
  console.log(cart);
  // console.log("product Quantity",productDetails);
  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product Quantity Increased!"));
});

module.exports.decreaseQuantity = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new ApiError(404, "Cart Not Found!");
    }
    let product = cart.products.find((item) =>
      item.productId.equals(productId)
    );
    if (!product) {
      throw new ApiError(400, "Product not found in cart!");
    }

    product.quantity -= 1;

    if (product.quantity <= 0) {
      cart.products = cart.products.filter(
        (item) => !item.productId.equals(productId)
      );
    }

    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );
    cart.totalItems = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    console.log(cart);
    // console.log("product Quantity",productDetails);
    await cart.save();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product Quantity Increased!"));
  } catch (err) {
    console.log(err);
  }
});
