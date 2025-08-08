import { Router } from "express";
import { container } from "../../container.js";
import { RepositoryController } from "../controllers/repositoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router: Router = Router();
const controller = container.resolve(RepositoryController);

router.post("/", authMiddleware, controller.addRepository.bind(controller));
router.put("/", authMiddleware, controller.updateRepository.bind(controller));
router.delete(
  "/:id",
  authMiddleware,
  controller.deleteRepository.bind(controller),
);
router.get(
  "/",
  authMiddleware,
  controller.getRepositoriesByUserId.bind(controller),
);

export { router };

export default router;
