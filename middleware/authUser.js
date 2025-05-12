const Users = require("../models/users.models.js");
const jwt = require("jsonwebtoken");
const BlackListedToken = require("../models/blackListedToken.models.js");
const ApiError = require("../utils/ApiError.js");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const isTokenBlackListed = await BlackListedToken.findOne({ token: token }); // checking Is token Is blacklisted

  if (isTokenBlackListed) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await Users.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  req.user = decoded;
  return next();
};

module.exports.AdminProductAuth = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await Users.findById(decoded._id);
  console.log(user);
  if (!user || !user.isAdmin) {
    throw new ApiError(401, "User not found");
  }
  req.user = decoded;
  return next();
};
