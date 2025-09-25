// import orderModel from "../../models/orderModel.js";
// import userModel from "../../models/userModel.js";

// const getAdminOrders = async (req, res) => {
//     try {
//         const order = await orderModel.find({
//             "products.seller": req.user._id,
//         });

//         res.status(200).send({
//             success: true,
//             orders: order,
//         });
//     } catch (error) {
//         console.error("Error in getting Orders:", error);
//         res.status(500).send("Error in getting orders");
//     }
// };

// export default getAdminOrders;

// //status=Delivered&dateFrom=2024-09-01&dateTo=2024-09-30&sort=desc&search=John&page=2&limit=10
import orderModel from "../../models/orderModel.js";

const getAdminOrders = async (req, res) => {
    try {
        const { status, dateFrom, dateTo, sort, search, page = 1, limit = 10 } = req.query;

        const query = {
            "products.seller": req.user._id,
        };

        // Filter by status
        if (status) {
            query.orderStatus = status;
        }

        // Filter by date range
        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
            if (dateTo) query.createdAt.$lte = new Date(dateTo);
        }

        // Search by product name
        if (search) {
            query["products.name"] = { $regex: search, $options: "i" };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort
        const sortOption = { createdAt: sort === "asc" ? 1 : -1 };

        // Query with filters
        const orders = await orderModel
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        // Count for pagination metadata
        const totalOrders = await orderModel.countDocuments(query);

        res.status(200).send({
            success: true,
            total: totalOrders,
            page: parseInt(page),
            pages: Math.ceil(totalOrders / parseInt(limit)),
            orders,
        });
    } catch (error) {
        console.error("Error in getting Orders:", error);
        res.status(500).send("Error in getting orders");
    }
};

export default getAdminOrders;
