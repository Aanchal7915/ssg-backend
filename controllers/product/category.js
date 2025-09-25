// controllers/categoryController.js
import Category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";
import cloudinary from "cloudinary";

// // Create Category
// export const createCategory = async (req, res) => {
//   try {
//     const category = new Category({ name: req.body.name });
//     const saved = await category.save();
//     res.status(201).json({ success: true, category: saved });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// Create Category with Image
export const createCategory = async (req, res) => {
  try {
    // Handle category image
    let categoryImage = null;
    if (req.body.image) {
      const result = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "categories",
      });
      categoryImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Create category
    const category = new Category({
      name: req.body.name,
      image: categoryImage, // added field
    });

    const saved = await category.save();
    res.status(201).json({ success: true, category: saved });
  } catch (error) {
    console.log("Create Category Error: " + error);
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

// Delete Category and its SubCategories
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const deleted = await Category.findByIdAndDelete(categoryId);
        if (!deleted) {

            return res.status(404).json({ success: false, message: "Category not found" });
        }
        // Also delete all subcategories under this category
        await SubCategory.deleteMany({ category: categoryId });
        res.status(200).json({ success: true, message: "Category and its subcategories deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};