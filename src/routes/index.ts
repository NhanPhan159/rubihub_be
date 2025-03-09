import { Router } from 'express';
import authRouter from './auth';
import chatRouter from './chat';
import userRouter from './user';
import adminRouter from './admin';
import questionRouter from './questions'
import { isAuthenticated, authorize } from '../middlewares';
import conversationRouter from './conversation';
import { Role } from '../enum';

const router = Router();

router.use('/auth', authRouter);
router.use('/chats', chatRouter);
router.use(isAuthenticated);
router.use('/users', userRouter);
router.use('/conversations', conversationRouter);
router.use('/admin', authorize([Role.ADMIN]), adminRouter);
router.use('/questions',authorize([Role.ADMIN]),questionRouter)

export default router;
