import { Router } from 'express';
import authRouter from './auth';
import chatRouter from './chat';
import userRouter from './user';
import adminRouter from './admin';
import { isAuthenticated, authorize } from '../middlewares';
import conversationRouter from './conversation';
import { Role } from '../enum';

const router = Router();

router.use('/auth', authRouter);
router.use('/chat', chatRouter);
router.use(isAuthenticated);
router.use('/user', userRouter);
router.use('/conversations', conversationRouter);
router.use('/admin', authorize([Role.ADMIN]), adminRouter);

export default router;
