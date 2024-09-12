import jwt from 'jsonwebtoken';
import configs from '../configs';

export const generateJWT = (payload: object): string => {
  return jwt.sign(payload, configs.JWT.PRIVATE_KEY, {
    audience: '',
    algorithm: configs.JWT.ALGORITHM as jwt.Algorithm,
    expiresIn: configs.JWT.EXPIRE_IN,
  });
};
