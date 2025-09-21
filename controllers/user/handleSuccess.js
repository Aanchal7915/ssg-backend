// import stripe from "stripe";
// import dotenv from "dotenv";
// dotenv.config();
// const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
// import orderModel from "../../models/orderModel.js";
// import mongoose from "mongoose";
// import productModel from "../../models/productModel.js";

// const handleSuccess = async (req, res) => {
//     try {
//         // Retrieve the session ID from the request body
//         const { sessionId, orderItems } = req.body;
//         console.log("sessionId, orderItems: ", sessionId, orderItems);

//         // Validate order items and session ID
//         if (!orderItems.length) {
//             return res.status(503).send("No OrderItems received from client!");
//         }
//         if (!sessionId) {
//             return res
//                 .status(503)
//                 .send("No sessionId for payment received from client!");
//         }

//         // Fetch the payment intent associated with the session
//         const session = await stripeInstance.checkout.sessions.retrieve(
//             sessionId
//         );
//         console.log("session: ", session);

//         // Extract the payment intent ID from the retrieved session
//         const paymentIntentId = session?.payment_intent;
//         const amount = session.amount_total;

//         // Map order items to the required format
//         const orderObject = orderItems?.map((product) => ({
//             name: product.name,
//             image: product.image,
//             brandName: product.brandName,
//             price: product.price,
//             discountPrice: product.discountPrice,
//             quantity: product.quantity,
//             productId: new mongoose.Types.ObjectId(product.productId),
//             seller: new mongoose.Types.ObjectId(product.seller),
//         }));

//         // Construct shipping information
//         const shippingObject = {
//             address: session?.customer_details?.address?.line1,
//             city: session?.customer_details?.address?.city,
//             state: session?.customer_details?.address?.state,
//             country: session?.customer_details?.address?.country,
//             pincode: session?.customer_details?.address?.postal_code,
//             phoneNo: session?.customer_details?.phone || "Not Provided",
//             landmark:
//                 session?.customer_details?.address?.line2 || "No Landmark",
//         };

//         // Create and save the order in the database
//         const combinedOrder = {
//             paymentId: paymentIntentId,
//             products: orderObject,
//             buyer: req.user._id,
//             shippingInfo: shippingObject,
//             amount: amount / 100,
//         };
//         const order = new orderModel(combinedOrder);
//         await order.save();

//         // Reduce stock for each product
//         for (const item of orderItems) {
//             const product = await productModel.findById(item?.productId);
//             if (product) {
//                 product.stock -= item?.quantity;
//                 await product.save();
//             } else {
//                 throw new Error(`Product with ID ${item.productId} not found`);
//             }
//         }

//         // Send success response
//         return res.status(200).send({ success: true });
//     } catch (error) {
//         console.error("Error in handling payment success:", error);
//         // Ensure you only send one response
//         return res.status(500).send("Error in handling payment success");
//     }
// };

// export default handleSuccess;



import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import orderModel from "../../models/orderModel.js";
import mongoose from "mongoose";
import productModel from "../../models/productModel.js";
import razorpayInstance from "../../config/payment.js";

dotenv.config();



const handleSuccess = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products:orderItems } = req.body;
    console.log("Payment details:", razorpay_order_id, razorpay_payment_id, razorpay_signature);

    // Validate order items and payment data
    if (!orderItems || !orderItems.length) {
      return res.status(400).send("No OrderItems received from client!");
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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
      address: req.body.shippingInfo?.address || "Not Provided",
      city: req.body.shippingInfo?.city || "Not Provided",
      state: req.body.shippingInfo?.state || "Not Provided",
      country: req.body.shippingInfo?.country || "Not Provided",
      pincode: req.body.shippingInfo?.pincode || "Not Provided",
      phoneNo: req.body.shippingInfo?.phoneNo || "Not Provided",
      landmark: req.body.shippingInfo?.landmark || "No Landmark",
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
