const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authUser");
const addressController = require("../controllers/address.controllers");

router.post("/add", authMiddleWare.authUser, addressController.addAddress);
router.get("/get-address", authMiddleWare.authUser, addressController.getAddress);

module.exports = router