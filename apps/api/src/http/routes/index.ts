import { Router } from 'express';
import { router as userRoutes } from './userRoutes';

const router: Router = Router();

router.use('/users', userRoutes);

export default router;