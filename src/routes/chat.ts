import { chatResponse, findChatsByConversation } from '../services';
import { Response, Request, Router, NextFunction } from 'express';
import { isAuthenticated } from '../middlewares';

const router = Router();

router.post('/private', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatData = req.body?.chatData;
    const userId = req.body?.user.id

    if (
      !chatData ||
      typeof chatData.message !== 'string' ||
      chatData.message.trim() === ''
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid request body. chatData cannot be empty.' });
    }

    const response = await chatResponse(chatData, userId);
    res.status(201).json({ response });
  } catch (error) {
    next(error)
  }
});

router.post('/public', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatData = req.body?.chatData;
    if (
      !chatData ||
      typeof chatData.message !== 'string' ||
      chatData.message.trim() === ''
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid request body. chatData cannot be empty.' });
    }

    const response = await chatResponse(chatData);
    res.status(201).json({ response });
  } catch (error) {
    next(error)
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const conversationData = req.body.conversationData;

  try {
    const chats = await findChatsByConversation(conversationData);

    res.status(200).json({ chats });
  } catch (error) {
    next(error)
  }
});

export default router;
