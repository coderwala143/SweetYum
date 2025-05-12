const User = require("../models/users.models.js");
const Product = require("../models/products.models.js");
const Rating = require("../models/rating.models.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");

module.exports.addRating = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  const { userRating, userReview } = req.body;
  const user = await User.findById(userId).populate("orders");
  const product = await Product.findById(productId).populate("reviews");

  if (!user || !product) {
    throw new ApiError(404, "User or Product Not Found!");
  }

  let isAlreadyRate = product.reviews.find((review) =>
    review.userId.equals(userId)
  );
  if (isAlreadyRate) {
    throw new ApiError(400, "You Have Already Rated this Product");
  }

  let hasPurchased = false;
  user.orders.forEach((order) => {
    order.products.find((item) => {
      if (item.productId.equals(productId)) {
        hasPurchased = true;
      }
    });
  });

  if (!hasPurchased) {
    throw new ApiError(400, "You have not purchased this product");
  }
  const rating = new Rating({
    username: user.fullname,
    userId: userId,
    productId: productId,
    rating: userRating,
    review: userReview,
  });

  await rating.save();
  product.reviews.push(rating);

  const ratingsSum = product.reviews.reduce(
    (sum, item) => sum + item.rating,
    0
  );
  const newAverage = ratingsSum / product.reviews.length;
  product.ratings = newAverage;
  await product.save();
  res
    .status(200)
    .json(new ApiResponse(200, rating, "Product rated Successfully!"));
});

module.exports.hasPurchased = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  const user = await User.findById(userId).populate("orders");
  const product = await Product.findById(productId).populate("reviews");

  if (!user || !product) {
    throw new ApiError(404, "User or Product Not Found!");
  }

  let hasPurchased = false;
  user.orders.forEach((order) => {
    order.products.find((item) => {
      if (item.productId.equals(productId)) {
        hasPurchased = true;
      }
    });
  });

  if (!hasPurchased) {
    throw ApiError(404, "You have not purchased this product");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, hasPurchased, "You have purchased this product")
    );
});
