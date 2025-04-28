const mongoose = require("mongoose")

const blackListTokenSchema = new mongoose.Schema({
    token: { 
        type: String, 
        required: true,
        unique: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        expires: 86400 // token will be deleted after 24h
    }
})

const blackListedToken =  mongoose.model("BlacklistToken", blackListTokenSchema);

module.exports = blackListedToken;