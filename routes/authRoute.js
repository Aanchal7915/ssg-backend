import express from "express";
import { registerController } from "../controllers/auth/registerController.js";
import { loginController } from "../controllers/auth/loginController.js";
import { userCheckController } from "../controllers/auth/userExist.js";
import { forgotPasswordController } from "../controllers/auth/forgotPassword.js";
import { updateDetailsController } from "../controllers/auth/updateDetails.js";
import { deactivateController } from "../controllers/auth/deactivateAccount.js";
import { isAdmin, isDeliveryAgent ,requireSignIn } from "../middleware/authMiddleware.js";
import sendOtp from "../controllers/auth/sendOtp.js";
//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//send-otp
router.post("/send-otp", sendOtp);

//USER EXIST || METHOD POST
router.post("/user-exist", userCheckController);

// FORGOT PASSWORD ROUTE
router.post("/forgot-password", forgotPasswordController);

//protected route-user
router.get("/user-auth", requireSignIn, (req, res) => {
    try {
        res.status(200).send({
            ok: true,
        });
    } catch (error) {
        console.log(error);
    }
});

//protected Admin route
router.get("/admin-auth", isAdmin, (req, res) => {
    res.status(200).send({
        ok: true,
    });
});

//protected Delivery-Agent route
router.get("/delivery-agent-auth", isDeliveryAgent, (req, res) => {
    res.status(200).send({
        ok: true,
    });
});

// update details POST route\
router.post("/update-details", updateDetailsController);

// deactivate account
router.post("/deactivate", deactivateController);

export default router;
