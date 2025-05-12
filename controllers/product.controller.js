const Product = require("../models/products.models");
const Cart = require("../models/cart.models");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const Category = require("../models/categories.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports.addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, ratings } = req.body;

  const productImageLocalPath = req.files?.productImage[0]?.path;
  console.log(req.files?.productImage[0]?.path);

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !stock ||
    !productImageLocalPath ||
    !ratings
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const isCategory = await Category.findOne({ name: category });
  if (!isCategory) {
    throw new ApiError(400, "Invalid category");
  }

  const productImage = await uploadOnCloudinary(productImageLocalPath);
  console.log(productImage);
  if (!productImage) {
    throw new ApiError(400, "Product Image Required");
  }

  const product = new Product({
    name,
    description,
    price,
    category: isCategory._id,
    stock,
    image: productImage.url,
    ratings,
  });
  await product.save();
  res
    .status(201)
    .json(new ApiResponse(200, product, "Product Created Successfully!"));
});

module.exports.getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .populate("reviews");
  if (products.length === 0) {
    res.status(204).json(new ApiResponse(204, "No Products Avaliable!"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, products, "All Product fetched Successfully!"));
});

module.exports.getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  const product = await Product.findById(productId)
    .populate("category")
    .populate("reviews");
  if (!product) {
    throw new ApiError(204, "Product Not Found");
  }
  res.status(200).json(new ApiResponse(200, product, "Product Found!"));
});

module.exports.updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { price, stock } = req.body;
  const productImageLocalPath = req.files?.productImage[0]?.path;
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(204, "Product Not Found");
  }

  if (!productImageLocalPath) {
    throw new ApiError(400, "Product Image Required");
  }

  let productImage = await uploadOnCloudinary(productImageLocalPath);

  if (!productImage) {
    throw new ApiError(400, "Product Image Required");
  }

  product.stock += parseInt(stock);
  product.price = price;
  product.image = productImage.url;
  await product.save();
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product Updated Successfully!"));
});

module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(204, "Product Not Found!");
  }
  await Product.deleteOne({ _id: productId });
  return res
    .status(200)
    .json(new ApiResponse(200, "Product Deleted Successfully"));
});

module.exports.searchProduct = asyncHandler(async (req, res) => {
  const search = req.query.search;
  const sortValue = parseInt(req.body.sortValue);
  if (sortValue !== 0) {
    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    })
      .populate("category")
      .sort({ price: sortValue });
    return res
      .status(200)
      .json(new ApiResponse(200, products, "Search Products"));
  }
  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  }).populate("category");
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Search Products"));
});

module.exports.productByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  const sortValue = parseInt(req.body.sortValue);

  if (sortValue > 1 || sortValue < -1) {
    throw new ApiError(400, "Sort Value Should 0, 1 or -1");
  }
  if (sortValue !== 0) {
    const products = await Product.aggregate([
      {
        $sort: { price: sortValue },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "CategoriesProduct",
        },
      },
      {
        $unwind: "$CategoriesProduct",
      },
      {
        $match: { "CategoriesProduct.name": category },
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, products, "Selected Categories Products"));
  }
  const products = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "CategoriesProduct",
      },
    },
    {
      $unwind: "$CategoriesProduct",
    },
    {
      $match: { "CategoriesProduct.name": category },
    },
  ]);
  if (products.length === 0) {
    return res
      .status(204)
      .json(new ApiResponse(204, "Selected categories product not Available!"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Selected Categories Products"));
});

module.exports.productByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  const products = await Product.find({
    price: { $min: minPrice, $max: maxPrice },
  });
  if (products.length == 0) {
    return res
      .status(404)
      .json(new ApiResponse(204, "Not Available Product In This price Range"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, products, "Products In Price Range!"));
});
