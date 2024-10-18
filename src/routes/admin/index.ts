import { NextFunction, Request, Response, Router } from 'express';
import { logSummaryUserActivities, requestsInWeek } from '../../services';

const router = Router();
router.get(
  '/requests-week',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query.currentDate) {
        const result = await requestsInWeek(
          new Date(req.query.currentDate as string),
        );
        return res.json(result);
      }
      throw new Error('missing params');
    } catch (error) {
      next(error);
    }
  },
);
router.get(
  '/activity-log/:date',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (_req.params) {
        const logUsers = await logSummaryUserActivities(
          new Date(_req.params.date),
        );
        res.status(200).json(logUsers);
      }
      throw new Error('missing params');
    } catch (error) {
      next(error);
    }
  },
);

export default router;
