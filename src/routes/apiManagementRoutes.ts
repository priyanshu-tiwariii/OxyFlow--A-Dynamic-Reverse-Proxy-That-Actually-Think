import { Router } from "express";
import { createContainers } from "../controllers/apiManagementControllers.js";

const apiManagementRoutes = Router();
apiManagementRoutes.post("/", createContainers);

export default apiManagementRoutes;
