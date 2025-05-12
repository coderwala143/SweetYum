const Category = require("../models/categories.models");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");

module.exports.addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    throw new ApiError(400, "Category name Required!");
  }
  const isAlreadyExist = await Category.findOne({name});
  if(!isAlreadyExist){
    throw new ApiError(409, "Category name already exist!");
  }
  const category = new Category({ name });
  await category.save();
  res.status(201).json(new ApiResponse(200, category, "Categories Added Successfully!"));
});

module.exports.getCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(200).json(new ApiResponse(200, categories, "All category fetched!"));
});
