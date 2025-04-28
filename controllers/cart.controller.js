const Cart = require("../models/cart.models");
const Product = require("../models/products.models");


module.exports.addProductInCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.user._id
        const product = await Product.findById(productId).populate('category').populate('ratings').populate('reviews');
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        console.log()

        // finding the current User Cart
        let cart = await Cart.findOne({userId});

        //Checking if cart is empty
        if(!cart) {
            cart = new Cart({userId, products: [], totalItems: 0, totalPrice: 0}); // if cart is empty then created the new cart 
        }
        const productInCart = cart.products.find(item => item.productId.equals(productId)); // checking product is already in cart

        //if yes then just increasing the quantity
        if(productInCart) {
            productInCart.quantity += 1;
        }

        // if not then pushed product in cart
        else {
            cart.products.push({productId, quantity: 1, priceAtPurchase: product.price});
        }
        //calculating total Items
        cart.totalItems = cart.products.reduce((sum,p) => sum+p.quantity, 0);
        //calculating total Price
        cart.totalPrice = cart.products.reduce((sum, p) => sum + (p.priceAtPurchase * p.quantity), 0)    

        await cart.save().then(async() => {
            await product.save()
        }) //saved the cart so it will change in data

        res.status(200).json({message: "Product Added To Cart Successfully"});
        
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Error fetching product"});
    }
}

module.exports.getCart = async(req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("products.productId");
        console.log(cart)

        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(item => item.productId !== null); // filtering only the product is Not deleted

        cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0); // updating total price
        cart.totalItems = cart.products.reduce((sum, item) => (sum + item.quantity),0) // updating total items

        await cart.save();
        res.status(200).json(cart);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Error fetching cart"});
    }
} 

module.exports.removeItemFromCart = async (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId)
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        let isProductInCart = cart.products.some((item) => item.productId.equals(productId))
        if(!isProductInCart){
            return res.status(404).json({message: "Product not found in cart"});
        }
        cart.products = cart.products.filter((item) => !item.productId.equals(productId))
        cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity),0);
        cart.totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
       
        await cart.save();
        res.json({message: "removed item from cart successfully"});
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Error fetching cart"});
    }
} 

module.exports.increaseQuantity = async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        let product = cart.products.find((item) => item.productId.equals(productId));
        if(!product){
            return res.status(404).json({message: "Product not found in cart"});
        }

        product.quantity += 1;
        
        cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity),0);
        cart.totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        console.log(cart)
        // console.log("product Quantity",productDetails);
        await cart.save()
        return res.status(200).json({message: "Product Quantity Decreased"})
    } catch (err) {
        console.log(err)
    }
}

module.exports.decreaseQuantity = async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        let product = cart.products.find((item) => item.productId.equals(productId));
        if(!product){
            return res.status(404).json({message: "Product not found in cart"});
        }

        product.quantity -= 1;

        if(product.quantity <= 0){
            cart.products =  cart.products.filter((item) => !item.productId.equals(productId));
        }
        
        cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity),0);
        cart.totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        console.log(cart)
        // console.log("product Quantity",productDetails);
        await cart.save()
        return res.status(200).json({message: "Product Quantity Decreased"});
    } catch (err) {
        console.log(err)
    }
}