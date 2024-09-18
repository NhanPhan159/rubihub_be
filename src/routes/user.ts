import { NextFunction, Request, Response, Router } from 'express';
import { findUserById } from '../services';

const router = Router();

router.get(
  '/profile',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.user.id;

      const { _id, ...user } = await findUserById(userId);

      res.status(200).json({
        ...user,
        id: _id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
