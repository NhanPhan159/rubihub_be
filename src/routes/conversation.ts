import { Response, Request, Router, NextFunction } from 'express';
import { createConversation, findConversationsByUserId, updateConversation } from '../services';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  try {
    const conversations = await findConversationsByUserId(user._id);

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

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const conversationId = req.params.id;
  const conversationName = req.body.name;

  try {
    const conversation = await updateConversation(conversationId, conversationName);

    res.status(200).json({ conversation });
  } catch (error) {
    next(error);
  }
});

export default router;
