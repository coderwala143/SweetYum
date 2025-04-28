const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        require: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
        require: true
    },
    rating:{
        type: Number,
        require: true,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0,
        min: [0, "You can rate 0 to 5"]
    },
    review:{
        type: String,
        maxLength: 500
    }
}, {timestamps: true});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating