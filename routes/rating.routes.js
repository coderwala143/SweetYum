const express = require("express");
const  authMiddleWare  = require("../middleware/authUser");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

router.post("/add-rating/:productId", authMiddleWare.authUser, ratingController.addRating);
router.post("/check-product-purchased/:productId", authMiddleWare.authUser, ratingController.hasPurchased);

module.exports = router;