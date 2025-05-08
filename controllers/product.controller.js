const Product = require("../models/products.models");
const Cart  = require("../models/cart.models");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const Category = require("../models/categories.models");


module.exports.addProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      ratings,
      reviews,
    } = req.body;

    const productImageLocalPath = req.files?.productImage[0]?.path
    console.log(req.files?.productImage[0]?.path)

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !stock ||
      !productImageLocalPath ||
      !ratings
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    
    const isCategory = await Category.findOne({name: category});
    if (!isCategory) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const productImage = await uploadOnCloudinary(productImageLocalPath);
    console.log(productImage)
    if(!productImage){
      return res.status(400).json({message: "Product Image Required"})
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
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
};

module.exports.getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.find().populate('category').populate('ratings').populate('reviews');
        console.log(products);
        res.status(200).json(products);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products" });
    }
}

module.exports.getProduct = async(req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.user._id
        const product = await Product.findById(productId).populate('category').populate('ratings').populate('reviews');
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Error fetching product" });
    }
}

module.exports.updateProduct = async(req, res, next) => {
    const productId = req.params.productId;
    const {price, stock} = req.body;
    const productImageLocalPath = req.files?.productImage[0]?.path;
    try{

    const product = await Product.findById(productId);
    if(!product){
      return res.status(400).json({message: "Product Not Found"})
    }

    if(!productImageLocalPath){
      return res.status(400).json({message: "Product Image Required"});
    }

    let productImage = await uploadOnCloudinary(productImageLocalPath);

    if(!productImage){
      return res.status(400).json({message: "Product Image Required"});
    }
    
    product.stock += parseInt(stock);
    product.price = price;
    product.image = productImage.url;
    await product.save();
    res.status(200).json(product);
  }catch(err){
    console.log("product updation error - ",err)
    return res.status(500).json({message: "Error While Updating the product"})
  }
}

module.exports.deleteProduct = async(req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId)
    if(!product){
        return res.status(404).json({message: "Product not Found"})
    }
    await Product.deleteOne({_id: productId});
    return res.status(200).json({message: "Product Deleted Successfully"}); 
}