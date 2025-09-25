import orderModel from "../../models/orderModel.js";
import userModel from "../../models/userModel.js";

const getOrders = async (req, res) => {
    try {
        const { status, dateFrom, dateTo, sort, search, page = 1, limit = 10 } = req.query;

        const query = { buyer: req.user._id };

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

        // Query with filters + populate
        const orders = await orderModel
            .find(query)
            .populate({ path: "buyer", model: userModel })
            .populate({ path: "products.seller", model: userModel })
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

export default getOrders;


// import orderModel from "../../models/orderModel.js";
// import userModel from "../../models/userModel.js";

// const getOrders = async (req, res) => {
//     try {
//         const order = await orderModel
//             .find({ buyer: req.user._id })
//             .populate({ path: "buyer", model: userModel })
//             .populate({ path: "products.seller", model: userModel });

//         res.status(200).send({
//             success: true,
//             orders: order,
//         });
//     } catch (error) {
//         console.error("Error in getting Orders:", error);
//         res.status(500).send("Error in getting orders");
//     }
// };

// export default getOrders;
