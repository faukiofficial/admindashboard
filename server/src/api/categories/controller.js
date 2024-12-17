const Category = require("../categories/model");

// create category
exports.createCategory = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Name and code are required",
            });
        }

        if (await Category.findOne({ code })) {
            return res.status(400).json({
                success: false,
                message: "Code already exists",
            });
        }

        if (await Category.findOne({ name })) {
            return res.status(400).json({
                success: false,
                message: "Name already exists",
            });
        }

        const category = await Category.create({ name, code });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error creating category",
        });
    }
};

// get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
        });
    }
};

// get category by id
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching category",
        });
    }
}

// update category by id
exports.updateCategoryById = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Name and code are required",
            });
        }

        if (await Category.findOne({ code, _id: { $ne: req.params.id } })) {
            return res.status(400).json({
                success: false,
                message: "Code already exists",
            });
        }

        if (await Category.findOne({ name, _id: { $ne: req.params.id } })) {
            return res.status(400).json({
                success: false,
                message: "Name already exists",
            });
        }

        const category = await Category.findByIdAndUpdate(req.params.id, { name, code }, { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error updating category",
        });
    }
}

// delete category by id
exports.deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false, 
            message: "Error deleting category",
        });
    }
}