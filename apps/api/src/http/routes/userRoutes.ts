import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router: Router = Router();
const controller = new UserController();

router.get('/:id', controller.getUser.bind(controller));
router.post('/', controller.createUser.bind(controller));

export { router };

export default router;
