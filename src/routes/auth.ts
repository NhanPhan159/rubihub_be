import { Request, Response, NextFunction, Router } from 'express';
import {
  CreateUserData,
  UserCredentials,
  STRING_INPUT_MAX_LENGTH,
  VALID_EMAIL_REGEX,
  UserDetails,
} from '../contracts';
import Joi from 'joi';
import {
  authenticateUser,
  checkIfEmailExist,
  createUser,
  findUserByEmail,
  getTokens,
} from '../services';
import configs from '../configs';
import {
  clientToken,
  generateJWT,
  generateRandomPassword,
  generateUrlGoogle,
} from '../utils';
import { Types } from 'mongoose';
import axios from 'axios';

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

      res.status(201).json(accessToken);
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

router.get('/google', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const urlGoogle = generateUrlGoogle();

    res.send(urlGoogle);
  } catch (error) {
    next(error);
  }
});

router.get(
  `/${configs.GOOGLE_AUTH.REDIRECT_URI}`,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code as string;

      const { id_token, access_token } = await getTokens({
        code,
        ...clientToken,
      });

      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        },
      );

      const data = await response.data;

      let user: UserDetails = {
        email: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: new Types.ObjectId(),
      };

      if (!(await checkIfEmailExist(data.email))) {
        const userCreate: CreateUserData = {
          email: data.email,
          password: generateRandomPassword(8),
        };
        user = await createUser(userCreate);
      } else {
        user = await findUserByEmail(data.email);
      }

      const accessToken = generateJWT({ id: user._id, email: user.email });

      res.cookie('auth_gg', accessToken, { secure: true });
      res.redirect(configs.GOOGLE_AUTH.UI_ROOT_URI);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/logout', (_req: Request, res: Response) => {
  res.clearCookie('auth_gg', { secure: true });
  res.clearCookie('auth', { secure: true });
  res.status(200).send('Logout successfully');
});

export default router;
