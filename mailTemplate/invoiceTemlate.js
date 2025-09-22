const invoiceTemplate = ({ ORDER_ID, ORDER_DATE, PAYMENT_ID, TOTAL_AMOUNT, ITEMS_HTML, FULL_ADDRESS, CUSTOMER_NAME }) => {
    const YEAR = new Date().getFullYear();
    return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><title>SSg Invoice</title></head>
  <body style="font-family:Poppins,Arial,sans-serif;background:#fafafa;padding:20px;">
    <div style="max-width:700px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eee">
      <div style="background:#1a73e8;padding:15px;text-align:center;color:#fff;">
      <img src="https://res.cloudinary.com/dn0j5mkmb/image/upload/v1758556226/logo-10_begizj.png" alt="SSG Logo"
      style="height:80px;width:80px;" 
      >
      </br>
        <h2>SSg Order Invoice</h2>
        
      </div>
      <div style="padding:20px;">
        <p>Hello <strong>${CUSTOMER_NAME}</strong>,</p>
        <p>Thank you for your order! Here are your details:</p>
        <p><strong>Order ID:</strong> ${ORDER_ID}</p>
        <p><strong>Order Date:</strong> ${ORDER_DATE}</p>
        <p><strong>Payment ID:</strong> ${PAYMENT_ID}</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead>
            <tr style="background:#f0f0f0">
              <th style="padding:8px;border:1px solid #ccc">Item</th>
              <th style="padding:8px;border:1px solid #ccc">Qty</th>
              <th style="padding:8px;border:1px solid #ccc">Price</th>
              <th style="padding:8px;border:1px solid #ccc">Discount Price</th>
              <th style="padding:8px;border:1px solid #ccc">Total</th>
            </tr>
          </thead>
          <tbody>${ITEMS_HTML}</tbody>
        </table>
        <h3 style="text-align:right;">Grand Total: ₹${TOTAL_AMOUNT}</h3>
        <p><strong>Shipping Address:</strong></p>
        <p>${FULL_ADDRESS}</p>
        <p>— Team SSG</p>
      </div>
      <div style="background:#1c1c1c;color:#aaa;text-align:center;padding:10px;font-size:12px">
        &copy; ${YEAR} SSg. All rights reserved. | <a href="https://ssg-frontend-one.vercel.app" style="color:#1a73e8">Visit Website</a>
      </div>
    </div>
  </body>
  </html>`;
};

export default invoiceTemplate;