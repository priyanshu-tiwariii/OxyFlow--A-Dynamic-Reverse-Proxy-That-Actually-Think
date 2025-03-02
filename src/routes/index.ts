import { Router } from "express";
import apiManagementRoutes from "./apiManagementRoutes.js";

const router = Router();
router.use("/containers", apiManagementRoutes);
export default router;