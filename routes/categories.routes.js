const express = require("express");
const  authMiddleWare  = require("../middleware/authUser");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");


router.post("/add", authMiddleWare.AdminProductAuth, categoriesController.addCategory);
router.get("/category-list", authMiddleWare.authUser, categoriesController.getCategory);

module.exports = router