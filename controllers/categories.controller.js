const Category = require("../models/categories.models");

module.exports.addCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const category = new Category({name});
        await category.save();
        res.status(201).json({message: "Categories Added Successfully!"});
    } catch (error) {
        console.log("Error While Adding New Category - ", error);
        res.status(500).json({message: "Internal server Error"})
    }
}
module.exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find({});
        res.status(201).json(category);
    } catch (error) {
        console.log("Error While getting  Categories - ", error);
        res.status(500).json({message: "Internal server Error"})
    }
}