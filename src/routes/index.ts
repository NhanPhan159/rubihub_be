import { Router } from 'express';
import authRouter from './auth';
import chatRouter from './chat';
import { isAuthenticated } from '../middlewares';

const router = Router();

router.use('/auth', authRouter);
router.use(isAuthenticated);
router.use('/chat', chatRouter);

export default router;
