const mongoose  = require("mongoose");

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    alternatePhoneNumber: {
        type: Number,
    },
    pincode:{
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    HouseNo:{
        type: String,
        required: true
    },
    colony: {
        type: String,
        required: true
    }
},{timestamps: true});


const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

module.exports = Address;