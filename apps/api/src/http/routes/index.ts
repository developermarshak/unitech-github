import { Router } from "express";
import { router as userRoutes } from "./userRoutes.js";
import { router as repositoryRoutes } from "./repositoryRoutes.js";

const router: Router = Router();

router.use("/users", userRoutes);
router.use("/repositories", repositoryRoutes);

export default router;
