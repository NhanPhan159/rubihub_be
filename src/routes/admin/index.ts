import { NextFunction, Request, Response, Router } from 'express';
import { logSummaryUserActivities } from '../../services';

const router = Router();

router.get(
  '/activity-log',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const logUsers = await logSummaryUserActivities();
      res.status(200).json(logUsers);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
