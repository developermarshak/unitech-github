import { Router } from 'express';
import { container } from '../../container';
import { RepositoryController } from '../controllers/repositoryController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = Router();
const controller = container.resolve(RepositoryController);

router.post('/', authMiddleware, controller.addRepository.bind(controller));
router.get('/', authMiddleware, controller.getRepositoriesByUserId.bind(controller));

export { router };

export default router; 