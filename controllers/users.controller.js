const { validationResult } = require("express-validator");
const Users = require("../models/users.models.js");
const BlackListedToken = require("../models/blackListedToken.models.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const {validatePhoneNum} = require("../utils/validatePhone.js")
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, phoneNo, isAdmin } = req.body;
  
  if(!fullname.firstname?.trim() || !email?.trim() || !password?.trim() || !phoneNo){
    return res.status(400).json({message: "All fields are Required"})
  }
  
  //Checking For Number Is Valid
  validatePhoneNum(phoneNo);
  
  const isAlreadyExisted = await Users.findOne({ email });
  if (isAlreadyExisted) {
    return res.status(400).json({ message: "Email already exists" });
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

  const token = user.generateAuthToken();
  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  if(!email?.trim() || !password?.trim()){
    return res.status(400).json({message: "All field are Required"})
  }
  
  const user = await Users.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ token, user });
};

module.exports.userProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie("token");
  await BlackListedToken.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};


module.exports.deleteUser = async(req, res) => {
    const userId = req.params.userId;

    const user = await Users.findById(userId);

    if(!user){
        return res.send(404).json({message: "User Not Exists"})
    }
    await Users.deleteOne({userId})
}

module.exports.uploadPicture = async(req, res) => {
  const userId = req.user._id
  console.log(req.files);
  const profilePictureLocalPath = req.files?.profilePicture[0]?.path;
  console.log(profilePictureLocalPath)
  try{

  if(!profilePictureLocalPath){
    res.status(400).json({message: "Profile Picture Required"})
  }

  const profilePicture = await uploadOnCloudinary.uploadOnCloudinary(profilePictureLocalPath);
  if(!profilePicture){
    return res.status(400).json({message: "Profile Picture file is Required"})
  }
  let user = await Users.findById(userId)
  user.profilePicture = profilePicture.url;
  
  await user.save().then(() => {
    console.log("Profile Picture Uploaded")
  })
  res.status(201).json({message: "Profile Picture Uploaded Successfully", user: user });
}catch(err){
  console.log(err);
  return res.status(500).json({message: "Error While Uploading Profile Picture"})
}
}


