import { Response, Request, Router } from 'express';
import Joi from 'joi';

import * as Contract from '../contracts';

import { createUser } from '../services';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const data = req.body;

  const validatedData = await Joi.object<Contract.CreateUserData>({
    email: Joi.string()
      .max(Contract.STRING_INPUT_MAX_LENGTH)
      .regex(Contract.VALID_EMAIL_REGEX)
      .required(),
    password: Joi.string().required(),
    firstName: Joi.string().max(Contract.STRING_INPUT_MAX_LENGTH),
    lastName: Joi.string().max(Contract.STRING_INPUT_MAX_LENGTH),
  }).validateAsync(data);

  const user = await createUser(validatedData);

  res.status(201).json({ user });
});

export default router;
