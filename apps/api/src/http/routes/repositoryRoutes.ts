import { Router } from 'express';
import { container } from '../../container';
import { RepositoryController } from '../controllers/repositoryController';

const router: Router = Router();
const controller = container.resolve(RepositoryController);

router.post('/', controller.addRepository.bind(controller));

export { router };

export default router; 