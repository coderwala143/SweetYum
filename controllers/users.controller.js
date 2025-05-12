const { validationResult } = require("express-validator");
const Users = require("../models/users.models.js");
const BlackListedToken = require("../models/blackListedToken.models.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const {validatePhoneNum} = require("../utils/validatePhone.js")
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js")

module.exports.registerUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "validation failed", errors.array())
  }
  const { fullname, email, password, phoneNo, isAdmin } = req.body;
  
  if(!fullname.firstname?.trim() || !email?.trim() || !password?.trim() || !phoneNo){
    throw new ApiError(400, "All fields are required")
  }
  
  //Checking For Number Is Valid
  validatePhoneNum(phoneNo);
  
  const isAlreadyExisted = await Users.findOne({ email });
  if (isAlreadyExisted) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await Users.hashPassword(password);

  const user = await Users.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashedPassword,
    phoneNo,
    isAdmin
  });

  const createdUser = await Users.findById(user._id).select("-isAdmin");

  if(!createdUser){
    throw new ApiError(500, "Something Went wrong while registering the user");
  }

  res.status(201).json(
    new ApiResponse(200, createdUser, "User Created Successfully!")
  )
})

module.exports.loginUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "validation failed", errors.array())
  }

  const { email, password } = req.body;

  if(!email?.trim() || !password?.trim()){
    throw new ApiError(400, "All field are Required!")
  }
  
  const user = await Users.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not exist!")
  }
  console.log("Before password check")

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    console.log("Inside password mismatch")
    throw new ApiError(400, "Invalid email or password!")
  }
  console.log("After password check")

  const token = user.generateAuthToken();
  res.cookie("token", token, {secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000});
  res.status(200).json(new ApiResponse(200, user, "Login Successfully!", token));
});

module.exports.userProfile = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized")
  }
  const user = await Users.findById(req.user._id).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found")
  }
  res.status(200).json(new ApiResponse(200, user));
});

module.exports.deleteUser = asyncHandler(async(req, res) => {
  const userId = req.params.userId || req.user._id;
  const user = await Users.findById(userId);
  if(!user){
      throw new ApiError(404, "User not Found!");
  }
  await Users.deleteOne({userId}).then(() => {
    res.status(200).json(
      new ApiResponse(200, user, "User Deleted Successfully!")
    )
  })
})

module.exports.uploadPicture = asyncHandler(async(req, res) => {
  const userId = req.user._id
  console.log(req.files);
  const profilePictureLocalPath = req.files?.profilePicture[0]?.path;
  console.log(profilePictureLocalPath)
  if(!profilePictureLocalPath){
    throw new ApiError(400, "ProfilePicture file is Required")
  }

  const profilePicture = await uploadOnCloudinary.uploadOnCloudinary(profilePictureLocalPath);
  if(!profilePicture){
    throw new ApiError(400, "ProfilePicture file is Required")
  }
  let user = await Users.findById(userId)
  user.profilePicture = profilePicture.url;
  
  await user.save().then(() => {
    console.log("Profile Picture Uploaded")
  })

  return res.status(201).json(
    new ApiResponse(200, user, "Profile Picture Uploaded Successfully!")
  )
})

module.exports.logoutUser = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  const user = await Users.findById(req.user._id)
  if(!user){
    throw new ApiError(404, "Unauthorized")
  }
  res.clearCookie("token");
  await BlackListedToken.create({ token });
  res.status(200).json(new ApiResponse(200, user, "Logout Successfully!"));
});


