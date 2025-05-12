const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/users.controller.js");
const authMiddleWare  = require("../middleware/authUser.js");
const { upload } = require("../middleware/multer.middleware.js")

router.post("/register", 
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
        body("phoneNo").isLength({ min: 10 }).withMessage("Phone Number must be at least 10 digit long"),
        body("fullname.firstname").isLength({min: 3}).withMessage("firstname must be at least 3 characters long"),

    ],
    userController.registerUser
)

router.post("/login", 
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("password").isLength({ min: 8 }).withMessage("Password must be at 8 character long")
    ],
    userController.loginUser
)
router.get("/profile", authMiddleWare.authUser, userController.userProfile);

router.get("/logout", authMiddleWare.authUser ,userController.logoutUser);

router.delete("/delete-user/:userId", authMiddleWare.authUser || authMiddleWare.AdminProductAuth, userController.deleteUser);

router.patch("/upload-profile", authMiddleWare.authUser , upload.fields([
    {
        name: 'profilePicture',
        maxCount: 1
    }
]), userController.uploadPicture);

module.exports = router;