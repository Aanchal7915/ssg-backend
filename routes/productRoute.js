import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import newProduct from "../controllers/product/newProduct.js";
import getSellerProducts from "../controllers/product/getSellerProducts.js";
import deleteProduct from "../controllers/product/deleteProduct.js";
import findProduct from "../controllers/product/findProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";
import getFilteredProducts from "../controllers/product/getFilteredProducts.js";
import searchProductController from "../controllers/product/searchProductController.js";
import {createCategory, getCategories, deleteCategory} from "../controllers/product/category.js";
import {getSubCategories, createSubCategory, deleteSubCategory} from "../controllers/product/subCategory.js";
import { getProductReviews } from "../controllers/product/getRatingAndReviews.js";

//router object
const router = express.Router();

//get popular products
import { getPopularProducts } from "../controllers/product/getPopularProduct.js"
router.get("/popular-products", getPopularProducts);

//get rating reviews
router.get("/reviews/:productId", getProductReviews);

//add category
router.post("/add-category", isAdmin, createCategory);

//delete category
router.delete("/delete-category/:categoryId", isAdmin, deleteCategory);

//add subcategory
router.post("/add-subcategory", isAdmin, createSubCategory);

//delete sub category
router.delete("/delete-subcategory/:subCategoryId", isAdmin, deleteSubCategory);

//get category
router.get("/get-category", getCategories)

//get sub-catgegory
router.get("/get-subcategory/:categoryId", getSubCategories)


//Add new product POST
router.post("/new-product", isAdmin, newProduct);

//Get Seller Product
router.get("/seller-product", isAdmin, getSellerProducts);

//Delete Product
router.post("/delete-product", isAdmin, deleteProduct);

//find filtered product
router.get("/filtered-products", getFilteredProducts);

//find product details from product id
router.get("/:id", findProduct);

//update product details from product id
router.patch("/update/:id", isAdmin, updateProduct);

// search products using keyword
router.get("/search/:keyword", searchProductController);

export default router;
