import { Router } from 'express';
import { container } from '../../container';
import { UserController } from '../controllers/userController';

const router: Router = Router();
const controller = container.resolve(UserController);

router.post('/', controller.createUser.bind(controller));
router.post('/session', controller.createSession.bind(controller));

export { router };

export default router;
