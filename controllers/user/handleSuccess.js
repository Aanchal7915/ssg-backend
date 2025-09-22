import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import orderModel from "../../models/orderModel.js";
import mongoose from "mongoose";
import productModel from "../../models/productModel.js";
import razorpayInstance from "../../config/payment.js";
import Address from "../../models/addressModel.js";
dotenv.config();



const handleSuccess = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products:orderItems } = req.body;
    console.log("Payment details:", razorpay_order_id, razorpay_payment_id, razorpay_signature);

    // Validate order items and payment data
    if (!orderItems || !orderItems.length) {
      return res.status(400).send("No OrderItems received from client!");
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature ) {
      return res.status(400).send("Incomplete payment details received!");
    }

    // Verify Razorpay payment signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).send("Invalid payment signature!");
    }
    console.log("products: ", orderItems);

    const address = await Address.findOne({customer: req.user._id , isDefault: true});
    if (!address) {
      return res.status(404).send("Shipping address not found!");
    }

    // Map order items
    const orderObject = orderItems.map((product) => ({
      name: product.name,
      image: product.image,
      brandName: product.brandName,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: product.quantity,
      productId: new mongoose.Types.ObjectId(product.productId),
      seller: new mongoose.Types.ObjectId(product.seller._id),
    }));

    // Construct shipping info
    const shippingObject = {
      name: address?.fullName || "No Name",
      email: req.user?.email || "No Email",
      locality:address?.locality || "Not Provided",
      address: address?.streetAddress || "Not Provided",
      city: address?.city || "Not Provided",
      state: address?.state || "Not Provided",
      country: address?.country || "Not Provided",
      pincode: address?.pincode || "Not Provided",
      phoneNo: address?.phoneNumber || "Not Provided",
      alternatePhoneNo:address?.alternatePhoneNumber || "Not Provided",
      landmark: address?.landmark || "No Landmark",
    };

    // Save order to DB
    const combinedOrder = {
      paymentId: razorpay_payment_id,
      products: orderObject,
      buyer: req.user._id,
      shippingInfo: shippingObject,
      amount: req.body.amount, // ensure client sends the correct total
    };

    const order = new orderModel(combinedOrder);
    await order.save();

    // Reduce stock for each product
    for (const item of orderItems) {
      const product = await productModel.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      } else {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
    }

    return res.status(200).send({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Error in handling Razorpay payment:", error);
    return res.status(500).send("Error in handling payment success");
  }
};

export default handleSuccess;
