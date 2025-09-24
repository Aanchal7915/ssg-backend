// controllers/subCategoryController.js
import SubCategory from "../../models/subCategoryModel.js";

// Create SubCategory under a Category
export const createSubCategory = async (req, res) => {
  try {
    const subCategory = new SubCategory({
      name: req.body.name,
      category: req.body.categoryId
    });
    const saved = await subCategory.save();
    res.status(201).json({ success: true, subCategory: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get SubCategories for a Category
export const getSubCategories = async (req, res) => {
  try {
    const subs = await SubCategory.find({ category: req.params.categoryId });
    res.status(200).json({ success: true, subCategories: subs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
