import { Router } from "express";
import { container } from "../../container.js";
import { UserController } from "../controllers/userController.js";

const router: Router = Router();
const controller = container.resolve(UserController);

router.post("/", controller.createUser.bind(controller));
router.post("/session", controller.createSession.bind(controller));

export { router };

export default router;
