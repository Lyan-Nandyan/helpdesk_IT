import express from "express";
import { cekHealth } from "../controllers/publicController.js";
const router = express.Router();

// Route untuk cek health
router.get("/health", cekHealth);
export default router;