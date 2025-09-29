// import mongoose from "mongoose";
// import SubCategory from "./models/subCategoryModel.js";
// import dotenv from "dotenv";
// dotenv.config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log(
//             `Connected to MongoDB database ${mongoose.connection.host}`
//         );
//     } catch (error) {
//         console.log(`Error in MongoDB connection- ${error}`);
//     }
// };

// const seedSubCategories = async () => {
//   try {
//     await connectDB();
//     // Clear old subcategories
//     await SubCategory.deleteMany();

//     // Your given category IDs
//     const electronicsId = "68d32a5528bd1c6bc2577be5";
//     const mobilesId = "68d32a5528bd1c6bc2577be6";
//     const jewelleryId = "68d32a5528bd1c6bc2577be7";
//     const clothingId = "68d32a5528bd1c6bc2577be8";

//     // Insert subcategories
//     await SubCategory.insertMany([
//       // Electronics
//       { name: "Laptops & Computers", category: electronicsId },
//       { name: "Home Appliances (Refrigerator, Washing Machine, Microwave, etc.)", category: electronicsId },
//       { name: "Kitchen Appliances (Mixer, Juicer, Induction, etc.)", category: electronicsId },
//       { name: "Audio & Accessories (Headphones, Speakers, Earbuds)", category: electronicsId },
//       { name: "Smart Gadgets (Smartwatches, Fitness Bands, Smart Home Devices)", category: electronicsId },

//       // Mobiles
//       { name: "Smartphones", category: mobilesId },
//       { name: "Feature Phones", category: mobilesId },
//       { name: "Mobile Covers & Cases", category: mobilesId },
//       { name: "Chargers & Power Banks", category: mobilesId },
//       { name: "Earphones & Bluetooth Devices", category: mobilesId },

//       // Jewellery
//       { name: "Gold Jewellery", category: jewelleryId },
//       { name: "Silver Jewellery", category: jewelleryId },
//       { name: "Imitation/Artificial Jewellery", category: jewelleryId },
//       { name: "Fashion Jewellery Sets", category: jewelleryId },
//       { name: "Watches & Accessories", category: jewelleryId },

//       // Clothing
//       { name: "Men’s Wear (Shirts, T-Shirts, Jeans, Ethnic Wear)", category: clothingId },
//       { name: "Women’s Wear (Sarees, Suits, Tops, Kurtis, Western Wear)", category: clothingId },
//       { name: "Kids’ Wear (Boys, Girls, Infants)", category: clothingId },
//       { name: "Footwear (Casual, Formal, Sports, Ethnic)", category: clothingId },
//       { name: "Accessories (Bags, Belts, Caps, Scarves)", category: clothingId },
//     ]);

//     console.log("✅ Subcategories seeded successfully!");
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("❌ Seeding error:", error);
//     mongoose.connection.close();
//   }
// };

// seedSubCategories();


import mongoose from "mongoose";
import dotenv from "dotenv";
import sgMail from '@sendgrid/mail';
dotenv.config();


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTestEmail = async () => {
    const msg = {
    to:"aanchal2115@gmail.com",
    from: 'scrapshera01@gmail.com', // your SendGrid verified sender email
    subject:"xyz",
    text:"test",
    html:"testing ....",
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }

  }
}

sendTestEmail();