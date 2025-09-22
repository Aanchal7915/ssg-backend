import dotenv from "dotenv";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
dotenv.config();



const generateInvoicePDF = async (order) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 750]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  let y = height - 50;
  page.drawText("SSG Invoice", { x: 50, y, size: 20, font, color: rgb(0.1, 0.3, 0.8) });

  y -= 40;
  page.drawText(`Order ID: ${order._id}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Payment ID: ${order.paymentId}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Date: ${new Date(order.createdAt).toLocaleString()}`, { x: 50, y, size: 12, font });

  y -= 40;
  page.drawText("Items:", { x: 50, y, size: 14, font });

  y -= 20;
  order.products.forEach((item) => {
    page.drawText(`${item.name} x${item.quantity} - Rs.${(item.price -item.discountPrice)* item.quantity}`, { x: 60, y, size: 12, font });
    y -= 20;
  });

  y -= 20;
  page.drawText(`Grand Total: Rs.${order.amount}`, { x: 50, y, size: 14, font, color: rgb(0, 0.6, 0.2) });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};



export default generateInvoicePDF;
