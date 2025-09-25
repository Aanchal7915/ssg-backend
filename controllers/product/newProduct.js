// import productModel from "../../models/productModel.js";
// import cloudinary from "cloudinary";

// const newProduct = async (req, res) => {
//     // console.log(req.body);
//     try {

       
//         let images = [];
//         if (typeof req.body.images === "string") {
//             images.push(req.body.images);
//         } else {
//             images = req.body.images;
//         }

//         const imagesLink = [];

//         for (let i = 0; i < images?.length; i++) {
//             const result = await cloudinary.v2.uploader.upload(images[i], {
//                 folder: "products",
//             });

//             imagesLink.push({
//                 public_id: result.public_id,
//                 url: result.secure_url,
//             });
//         }
//         req.body.logo
//         const result = await cloudinary.v2.uploader.upload(req.body.logo, {
//             folder: "brands",
//         });
//         const brandLogo = {
//             public_id: result.public_id,
//             url: result.secure_url,
//         };

//         req.body.brand = {
//             name: req.body.brandName,
//             logo: brandLogo,
//         };
//         req.body.images = imagesLink;
//         req.body.seller = req.user._id;

//         let specs = [];
//         req.body.specifications.forEach((s) => {
//             specs.push(JSON.parse(s));
//         });
//         req.body.specifications = specs;

//         const product = await productModel.create(req.body);

//         res.status(201).send({
//             success: true,
//             product,
//         });
//     } catch (error) {
//         console.log("New Product Error: " + error);
//         res.status(500).send({
//             success: false,
//             message: "Error in adding New Product",
//             error,
//         });
//     }
// };

// export default newProduct;


import productModel from "../../models/productModel.js";
import Category from "../../models/categoryModel.js"; // import Category model
import cloudinary from "cloudinary";
import SubCategory from "../../models/subCategoryModel.js";

const newProduct = async (req, res) => {
    try {
        
        // Handle images
        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        const imagesLink = [];
        for (let i = 0; i < images?.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        // Handle brand logo
        const result = await cloudinary.v2.uploader.upload(req.body.logo, {
            folder: "brands",
        });
        const brandLogo = {
            public_id: result.public_id,
            url: result.secure_url,
        };

        req.body.brand = {
            name: req.body.brandName,
            logo: brandLogo,
        };
        req.body.images = imagesLink;
        req.body.seller = req.user._id;

        // Parse specifications
        let specs = [];
        req.body.specifications.forEach((s) => {
            specs.push(JSON.parse(s));
        });
        req.body.specifications = specs;

        // Assign category and subcategory IDs
        // Expecting req.body.category and req.body.subCategory to be IDs
        const categoryExists = await Category.findById(req.body.category);
        if (!categoryExists) {
            return res.status(400).send({
                success: false,
                message: "Invalid category ID",
            });
        }

        const subCategoryExists = await SubCategory.findById(req.body.subcategory);
        if (!subCategoryExists) {
            return res.status(400).send({
                success: false,
                message: "Invalid subcategory ID",
            });
        }

        req.body.category = categoryExists._id;
        req.body.subcategory = subCategoryExists._id;

        // Create product
        const product = await productModel.create(req.body);

        res.status(201).send({
            success: true,
            product,
        });
    } catch (error) {
        console.log("New Product Error: " + error);
        res.status(500).send({
            success: false,
            message: "Error in adding New Product",
            error,
        });
    }
};

export default newProduct;
