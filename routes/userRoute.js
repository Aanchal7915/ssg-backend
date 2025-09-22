import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import getWishlistItems from "../controllers/user/getWishlistItems.js";
import updateWishlist from "../controllers/user/updateWishlist.js";
import getWishlistProducts from "../controllers/user/getWishlistProducts.js";
import createOrder from "../controllers/user/createOrder.js";
import handleSuccess from "../controllers/user/handleSuccess.js";
import getOrders from "../controllers/user/getOrders.js";
import getOrderDetail from "../controllers/user/getOrderDetail.js";
import getAdminOrders from "../controllers/user/getAdminOrders.js";
import updateOrder from "../controllers/user/updateOrder.js";
import getAllUserOrder from "../controllers/user/getAllUserOrder.js";
import  getCartAndSaveLater  from "../controllers/user/getCartAndSaveLater.js";
import  updateCartAndSaveLater  from "../controllers/user/updateCartAndSaveLater.js";
import{addReview} from "../controllers/user/ratingAndReview.js";
import getMyReviews from "../controllers/user/getRatingAndReview.js";
//address CRUD operations
import addAddress from "../controllers/user/addAddress.js";
import {getAddresses, getDefaultAddress} from "../controllers/user/getAddress.js";
import updateAddress from "../controllers/user/updateAddress.js";
import deleteAddress from "../controllers/user/deleteAddress.js";
import setDefaultAddress from "../controllers/user/setDefaultAddress.js";

//router object
const router = express.Router();

//routing
//get Cart and Save for later items
router.get("/cart-and-save-later", requireSignIn, getCartAndSaveLater);

//update Cart and Save for later items
router.post("/update-cart-and-save-later", requireSignIn, updateCartAndSaveLater);

//get Wishlist Items id
router.get("/wishlist", requireSignIn, getWishlistItems);

//update wishlist Items
router.post("/update-wishlist", requireSignIn, updateWishlist);

// get wishlist products
router.get("/wishlist-products", requireSignIn, getWishlistProducts);

// checkout session - stripe payment
router.post("/create-order", requireSignIn, createOrder);
router.post("/payment-success", requireSignIn, handleSuccess);

// get user orders
router.get("/orders", requireSignIn, getOrders);
router.get("/order-detail", requireSignIn, getOrderDetail);

//get admin orders
router.get("/admin-orders", isAdmin, getAdminOrders);
router.get("/admin-order-detail", isAdmin, getOrderDetail);

//update order status
router.patch("/update/order-status", isAdmin, updateOrder);

//get all order and delete if possible
router.get("/get-all-order", requireSignIn, getAllUserOrder);

//rating and review routes are in productRoute.js
router.post("/rating-review", requireSignIn, addReview);

//get all reviews of a user
router.get("/my-reviews", requireSignIn, getMyReviews);

// Add a new address
router.post("/add-address", requireSignIn, addAddress);
// Get all addresses of the logged-in user
router.get("/addresses", requireSignIn, getAddresses);
// Update an address
router.put("/update-address/:id", requireSignIn, updateAddress);
// Delete an address
router.delete("/delete-address/:id", requireSignIn, deleteAddress);
// Set an address as default
router.put("/set-default-address/:id", requireSignIn, setDefaultAddress);

//get default address of user
router.get("/default-address/:id", requireSignIn, getDefaultAddress);

export default router;
