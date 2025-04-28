const mongoose = require("mongoose");
const DB_NAME = require("../constants");
async function connectToDb(){
    try{
        let connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }catch(err){
        console.log("MONGODB connection error ", err);
    }
}
module.exports = connectToDb;
