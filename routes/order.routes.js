const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authUser")
const orderController = require("../controllers/order.controller")


router.post("/place-single-order/:productId", authMiddleWare.authUser, orderController.placeOrder);
router.post("/place-multiple-order", authMiddleWare.authUser, orderController.multipleOrder)

module.exports = router;