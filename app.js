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
const categoriesRoutes = require("./routes/categories.routes.js")

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())
connectToDb()

app.get('/' , (req, res) => {
    res.send("Hiiiii")
})
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ratings", ratingRoutes);

module.exports = app;