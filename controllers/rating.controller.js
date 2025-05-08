const User = require("../models/users.models.js");
const Product = require("../models/products.models.js");
const Rating = require("../models/rating.models.js");

module.exports.addRating = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  const { userRating, userReview } = req.body;

  try {
    const user = await User.findById(userId).populate("orders");
    const product = await Product.findById(productId).populate("reviews");
    console.log(user.fullname);

    if (!user || !product) {
      return res.status(404).json({ message: "User or Product Not Found!" });
    }

    let isAlreadyRate = product.reviews.find((review) =>
      review.userId.equals(userId)
    );
    if (isAlreadyRate) {
      return res
        .status(400)
        .json({ message: "You Have Already Rated this Product" });
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
      return res
        .status(404)
        .json({ message: "You have not purchased this product" });
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
    res.status(200).json({ message: "Product rated Successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Error while Rating");
  }
};

module.exports.hasPurchased = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  try {
    const user = await User.findById(userId).populate("orders");
    const product = await Product.findById(productId).populate("reviews");

    if (!user || !product) {
      return res.status(404).json({ message: "User or Product Not Found!" });
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
      return res
        .status(404)
        .json({ message: "You have not purchased this product" });
    }
    res.status(200).json({message: "You have purchased this product" ,hasPurchased})
  } catch (err) {
    console.log("Error while checking product is purchased - ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
