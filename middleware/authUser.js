const Users = require("../models/users.models.js");
const jwt = require("jsonwebtoken");
const BlackListedToken = require("../models/blackListedToken.models.js");



module.exports.authUser = async(req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    const isTokenBlackListed = await BlackListedToken.findOne({token: token}); // checking Is token Is blacklisted 

    if(isTokenBlackListed){
        return res.status(401).json({message: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Users.findById(decoded._id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        req.user = decoded;
        return next();
    }catch(err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports.AdminProductAuth = async(req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Users.findById(decoded._id);
        console.log(user);
        if(!user || !user.isAdmin){
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = decoded;
        return next();
    }catch(err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}
