import orderModel from "../../models/orderModel.js";
import userModel from "../../models/userModel.js";

const updateOrder = async (req, res) => {
    try {
        const { status, orderId } = req.body;
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true }
        );

        if (updateOrder) {
            res.status(200).send({
                success: true,
            });
        }
    } catch (error) {
        console.error("Error in updating Order Details:", error);
        res.status(500).send("Error in updating order details");
    }
};

export default updateOrder;



export const updateOrderTrack = async (req, res) => {
    try {
        const { trackingLink:trackLink, orderId } = req.body;
        console.log("req:", req.body);

        const existingOrder = await orderModel.findById(
            orderId
        );
        // console.log("order", existingOrder)
        existingOrder.trackLink = trackLink;
        existingOrder.save();
        console.log("tr:", existingOrder)
        res.status(200).send({
            success: true,
        });

    } catch (error) {
        console.error("Error in updating Order Details:", error);
        res.status(500).send("Error in updating order details");
    }
};


// POST /orders/:id/cancel-request
const requestCancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findOne({ _id: req.params.id, buyer: req.user._id });

    if (!order) return res.status(404).send({ success: false, message: "Order not found" });
    if (order.orderStatus === "Delivered") return res.status(400).send({ success: false, message: "Delivered order cannot be cancelled" });

    order.cancelRequest = true;
    order.cancelReason = req.body.reason;
    order.cancelStatus = "Pending";
    await order.save();

    res.status(200).send({ success: true, message: "Cancel request submitted" });
  } catch (error) {
    console.error("Cancel request error:", error);
    res.status(500).send("Error in cancel request");
  }
};

// PATCH /admin/orders/:id/cancel-action
const handleCancelRequest = async (req, res) => {
  try {
    const { action } = req.body; // "Approved" or "Rejected"
    const order = await orderModel.findById(req.params.id);

    if (!order || !order.cancelRequest) {
      return res.status(404).send({ success: false, message: "Cancel request not found" });
    }

    if (action === "Approved") {
      order.cancelStatus = "Approved";
      order.orderStatus = "Cancelled";
      order.canceledAt = new Date();
    } else {
      order.cancelStatus = "Rejected";
    }

    order.cancelRequest = false;
    await order.save();

    res.status(200).send({ success: true, message: `Cancel request ${action}` });
  } catch (error) {
    console.error("Cancel action error:", error);
    res.status(500).send("Error in handling cancel request");
  }
};
export { requestCancelOrder, handleCancelRequest };