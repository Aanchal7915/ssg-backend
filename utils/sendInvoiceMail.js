import sendMail from "./sendMail.js";
import invoiceTemplate from "../mailTemplate/invoiceTemlate.js";
import generateInvoicePDF from "./generateInvoicePDF.js";
import dotenv from "dotenv";
dotenv.config();

const sendInvoiceEmail = async (order, userEmail) => {
    // Items for email HTML
    let totalAmount = 0;
    const itemsHTML = order.products
        .map(
            (p) => {
                totalAmount =totalAmount+(p.price - p.discountPrice) * p.quantity;
                return `
    <tr>
      <td style="border:1px solid #ccc;padding:8px">${p.name}</td>
      <td style="border:1px solid #ccc;padding:8px">${p.quantity}</td>
      <td style="border:1px solid #ccc;padding:8px">₹${p.price}</td>
      <td style="border:1px solid #ccc;padding:8px">₹${p.discountPrice}</td>
      <td style="border:1px solid #ccc;padding:8px">₹${(p.price - p.discountPrice) * p.quantity}</td>
    </tr>`
            })
        .join("");

    order.amount = totalAmount;

    const html = invoiceTemplate({
        ORDER_ID: order._id,
        ORDER_DATE: new Date(order.createdAt).toLocaleString(),
        PAYMENT_ID: order.paymentId,
        TOTAL_AMOUNT: order.amount,
        ITEMS_HTML: itemsHTML,
        FULL_ADDRESS: `${order.shippingInfo.name}, ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pincode}, ${order.shippingInfo.country}`,
        CUSTOMER_NAME: order.shippingInfo.name,
    });

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(order);

    await sendMail({
        from: `"SSg Orders" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `Your Invoice - Order #${order._id}`,
        html,
        attachments: [
            {
                filename: `invoice-${order._id}.pdf`,
                content: pdfBuffer,
            },
        ],
    });
};


export default sendInvoiceEmail;