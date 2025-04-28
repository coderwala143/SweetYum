const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleWare  = require("../middleware/authUser");
const { body } = require("express-validator");
const { upload } = require("../middleware/multer.middleware");

router.post("/addproduct",[
    body("name").isLength({min: 2},{max: 100}).withMessage({message: "Product name must be at least 3 characters Long"},{message: "Product name must less than 100 characters"}),
    body("price").isNumeric().withMessage("Product price must be a number"),
    body("description").isLength({min: 2},{max: 1000}).withMessage("Product description must be at least 3 characters Long"),
    body("image").isURL().withMessage("Product image must be a valid URL"),
    body("stock").isNumeric().withMessage("Product  stock must be a number")
],
authMiddleWare.AdminProductAuth, upload.fields([
    {
        name: 'productImage',
        maxCount: 1
    }
]), productController.addProduct);
// get all product
router.get("/getproduct", authMiddleWare.authUser, productController.getAllProduct);

// get single product using product_id
router.get("/getproduct/:productId", authMiddleWare.authUser, productController.getProduct);

//update product details
router.patch("/updateproduct/:productId", authMiddleWare.AdminProductAuth, upload.fields([
    {
        name: 'productImage',
        maxCount: 1
    }
]),productController.updateProduct);

router.delete("/deleteproduct/:productId", authMiddleWare.AdminProductAuth, productController.deleteProduct);

module.exports = router;
