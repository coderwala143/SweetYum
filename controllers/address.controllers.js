const Address = require("../models/address.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

module.exports.addAddress = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {phoneNumber, alternatePhoneNumber, pincode, state, city, HouseNo, colony} = req.body
    if([pincode, state, city, HouseNo, colony].some((field) => !field?.trim()) || !phoneNumber){
        throw new ApiError(400, "All field required!")
    }
    const address = new Address({
        userId,
        phoneNumber, 
        alternatePhoneNumber,
        pincode,
        state,
        city,
        HouseNo,
        colony
    })
    await address.save();
    res.status(201).json(new ApiResponse(200, address, "Address Added Successfully!"))
});

module.exports.getAddress = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const addresses = await Address.find({userId});
    if(addresses.length === 0){
        res.status(200).json(new ApiResponse(200, null, "No Address Found!"));
    }
    res.status(200).json(new ApiResponse(200, addresses, "All Address Fetched!"));
})