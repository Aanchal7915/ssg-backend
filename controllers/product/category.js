// controllers/categoryController.js
import Category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    const saved = await category.save();
    res.status(201).json({ success: true, category: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Categories (with subcategories)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithSubs = await Promise.all(
      categories.map(async (cat) => {
        const subs = await SubCategory.find({ category: cat._id });
        return { ...cat.toObject(), subcategories: subs };
      })
    );
    res.status(200).json({ success: true, categories: categoriesWithSubs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
