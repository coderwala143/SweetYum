const express = require("express");
const  authMiddleWare  = require("../middleware/authUser");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

router.post("/add-rating/:productId", authMiddleWare.authUser, ratingController.addRating);

module.exports = router