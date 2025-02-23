import { NextFunction, Request, Response, Router } from 'express';
import { findUserById, updateProfile } from '../services';

const router = Router();

router.get(
  '/profile',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

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
router.put('/profile',async(req:Request, res:Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const resultNumber = await updateProfile(userId.toString(),req.body)
    if(resultNumber){
      res.json({"message": "successfully updated"}).status(200)
    }
  } catch (error) {
    console.log(error)
  }
})

export default router;
