import { Request, Response, NextFunction, Router } from 'express';
import {
  CreateUserData,
  UserCredentials,
  STRING_INPUT_MAX_LENGTH,
  VALID_EMAIL_REGEX,
} from '../contracts';
import Joi from 'joi';
import { authenticateUser, createUser } from '../services';

const router = Router();

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const validatedData = await Joi.object<UserCredentials>({
        email: Joi.string()
          .max(STRING_INPUT_MAX_LENGTH)
          .regex(VALID_EMAIL_REGEX)
          .required(),
        password: Joi.string().required(),
      }).validateAsync(data);

      const accessToken = await authenticateUser({
        email: validatedData.email,
        password: validatedData.password,
      });

      res.cookie('auth', accessToken, { httpOnly: true, secure: true });

      return res.status(201).json(accessToken);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const validatedData = await Joi.object<CreateUserData>({
        email: Joi.string()
          .max(STRING_INPUT_MAX_LENGTH)
          .regex(VALID_EMAIL_REGEX)
          .required(),
        password: Joi.string().required(),
        firstName: Joi.string().max(STRING_INPUT_MAX_LENGTH),
        lastName: Joi.string().max(STRING_INPUT_MAX_LENGTH),
      }).validateAsync(data);

      const user = await createUser(validatedData);

      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
