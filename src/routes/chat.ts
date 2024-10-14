import {
  chatResponsePrivate,
  chatResponsePublic,
  findChatsByConversation,
} from '../services';
import { Response, Request, Router, NextFunction } from 'express';
import { isAuthenticated } from '../middlewares';
import { getPagination } from '../utils';

const router = Router();

router.post(
  '/private',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatData = req.body?.chatData;
      const userId = req.user._id;

      if (
        !chatData ||
        typeof chatData.message !== 'string' ||
        chatData.message.trim() === ''
      ) {
        res
          .status(400)
          .json({ error: 'Invalid request body. chatData cannot be empty.' });
      }

      const response = await chatResponsePrivate(chatData, userId);
      res.status(201).json({ response });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/public',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = req.body?.message;
      if (!message || typeof message !== 'string' || message.trim() === '') {
        res
          .status(400)
          .json({ error: 'Invalid request body. chatData cannot be empty.' });
      }

      const response = await chatResponsePublic({ message });
      res.status(201).json({ response });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const conversationData = req.query;
    const conversationId = conversationData.conversationId as string;

    const pagination =
      req.query.page && req.query.limit
        ? getPagination(req.query.page as string, req.query.limit as string)
        : null;

    try {
      const paginatedChats = await findChatsByConversation(
        conversationId,
        pagination,
      );
      res.status(200).json(paginatedChats);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
