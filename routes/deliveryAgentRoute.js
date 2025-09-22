import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import addAgent from "../controllers/deliveryAgent/addAgent.js";
import deleteAgent from "../controllers/deliveryAgent/deleteAgent.js";
import {getAgentById, getAgent} from "../controllers/deliveryAgent/getAgent.js";
import updateAgent from "../controllers/deliveryAgent/updateAgent.js";

//router object
const router = express.Router();


router.post("/create",  isAdmin, addAgent );
router.get("/",  isAdmin, getAgent );
router.get("/:id",  isAdmin, getAgentById );
router.delete("/delete/:agentId",  isAdmin, deleteAgent );
router.put("/update/:agentId",  isAdmin, updateAgent );
export default router;


