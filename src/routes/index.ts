import { Router } from 'express';
import chatRouter from './chat'

const router = Router();

router.get('/', (_req, res) => {
    res.json({ message: 'Hello World' });
});

router.use('/chat', chatRouter);

export default router;
