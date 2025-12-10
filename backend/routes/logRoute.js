import express from "express";
import { getLogs } from "../controllers/logController.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
router.get("/", authenticate, authorizeRoles('manager'), getLogs);
export default router;
