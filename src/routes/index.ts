import { Router } from 'express';
import chatRouter from './chat';
import userRouter from './user';

const router = Router();

router.use('/chat', chatRouter);
router.use('/users', userRouter);

export default router;
