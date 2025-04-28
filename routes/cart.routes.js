const express = require("express");
const authMiddleWare = require("../middleware/authUser");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/add/:productId", authMiddleWare.authUser, cartController.addProductInCart);
router.get("/getcart", authMiddleWare.authUser, cartController.getCart);
router.delete("/removeproduct/:productId", authMiddleWare.authUser, cartController.removeItemFromCart);
router.patch("/increasequantity/:productId", authMiddleWare.authUser, cartController.increaseQuantity);
router.patch("/decreasequantity/:productId", authMiddleWare.authUser, cartController.decreaseQuantity);

module.exports = router;