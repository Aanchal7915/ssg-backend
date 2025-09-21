// import stripe from "stripe";
// // to resolve stripe secret key error again use dotenv here
// import dotenv from "dotenv";
// dotenv.config();
// const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// const createSession = async (req, res) => {
//     try {
//         const {
//             products,
//             frontendURL,
//             customerEmail,
//             customerPhone,
//             customerName,
//         } = req.body;
//         // console.log(frontendURL);
//         const successPath = "/shipping/confirm";
//         const cancelPath = "/shipping/failed";

//         const successURL = frontendURL + successPath;
//         const cancelURL = frontendURL + cancelPath;
//         // console.log(successURL, cancelURL);
//         const lineItems = products?.map((item) => ({
//             price_data: {
//                 currency: "inr",
//                 //price goes in decimal so we have to multiply by 100
//                 unit_amount: item.discountPrice * 100,
//                 product_data: {
//                     name: item?.name,
//                 },
//             },
//             quantity: item.quantity,
//         }));
//         const session = await stripeInstance.checkout.sessions.create({
//             payment_method_types: ["card"],
//             currency: "inr",
//             line_items: lineItems,
//             mode: "payment",
//             success_url: successURL,
//             cancel_url: cancelURL,
//             customer_email: customerEmail,
//             shipping_address_collection: {
//                 allowed_countries: ["IN"], // Limit address collection to specific countries if needed
//             },
//             phone_number_collection: {
//                 enabled: true,
//             },
//         });

//         console.log('session: ', session);
//         res.send({ session: session });
//     } catch (error) {
//         console.log("Error in creating stripe session id: " + error);
//         res.status(500).send({
//             success: false,
//             message: "Error in Payment Gateway",
//             error,
//         });
//     }
// };
// export default createSession;



import dotenv from "dotenv";
import razorpayInstance from "../../config/payment.js";
import userModel from "../../models/userModel.js";
dotenv.config();

const createOrder = async (req, res) => {
  try {
    const {
      products
    } = req.body;

    if (!products || !products.length) {
      return res.status(400).send({ success: false, message: "No products provided" });
    }

    const userId = req.user?._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Calculate total amount (in paise)
    const amount = products.reduce((sum, item) => {
      return sum + (item.price - item.discountPrice) * item.quantity * 100;
    }, 0);

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: amount, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1, // auto capture
      notes: {
        cart: JSON.stringify(products.map(item => item.productId)), // track which products this payment is for
        // your internal order ID
        userId: user._id
      },
    });

    // Send order details to frontend
    res.status(200).send({
      success: true,
      order: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    });
  } catch (error) {
    console.error("Error in creating Razorpay order:", error);
    res.status(500).send({
      success: false,
      message: "Error in Payment Gateway",
      error,
    });
  }
};

export default createOrder;
