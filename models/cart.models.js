const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true,
            },
            quantity: {
                type: Number,
                default: 1
            }, 
            priceAtPurchase: {
                type: Number,
                require: true,
                default: 0
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    totalItems:{
        type: Number,
        default:0
    },
    
    
}, { timestamps:true })

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;