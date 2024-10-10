import { Response, Request, Router, NextFunction } from 'express';
import { createConversation, findConversationsByUser } from '../services';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body.userData;

  try {
    const conversations = await findConversationsByUser(userData);

    res.status(200).json({ conversations });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const conversationToCreate = {
    name: req.body.conversationData.name,
    userId: req.user._id,
  };

  try {
    const conversations = await createConversation(conversationToCreate);

    res.status(201).json({ conversations });
  } catch (error) {
    next(error);
  }
});

export default router;
