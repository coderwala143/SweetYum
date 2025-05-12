const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors")
const connectToDb = require("./db/db")
const userRoutes = require("./routes/users.routes.js")
const productRoutes = require("./routes/product.routes.js");
const cartRoutes = require("./routes/cart.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const ratingRoutes = require("./routes/rating.routes.js");
const categoriesRoutes = require("./routes/categories.routes.js");
const addressRoutes = require("./routes/address.routes.js");
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: "http://127.0.0.1:5500",   
    credentials: true               
}));
app.use(cookieParser())

app.use(express.urlencoded({extended: true}));
app.use(express.json())
connectToDb()


app.get('/' , (req, res) => {
    res.json({message: "Hiiiii"})
})

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/address", addressRoutes);


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        stack: err.stack,
    });
});

module.exports = app;