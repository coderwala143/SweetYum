const mongoose = require("mongoose");
const jwt  = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long']
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        // match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address'],
        minlength: [5, "Email must be at least 5 characters long"]
    },
    password:{
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    phoneNo:{
        type: Number,
        required: true,
        unique: true,
        minlength: [10, "Phone Number must be at least 10 digit long"],
    },
    profilePicture: {
        type: String,
        default: ''
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY,{expiresIn: "1h"});
    return token;
};

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}
const Users = mongoose.model("User", userSchema);

module.exports = Users;