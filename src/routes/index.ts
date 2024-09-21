import { Router } from 'express';
import authRouter from './auth';
import chatRouter from './chat';
import userRouter from './user';
import { isAuthenticated } from '../middlewares';
import conversationRouter from './conversation';

const router = Router();

router.use('/auth', authRouter);
router.use('/chat', chatRouter);
router.use(isAuthenticated);
router.use('/user', userRouter);
router.use('/conversations', conversationRouter);

export default router;
