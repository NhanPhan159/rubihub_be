import { ExtractProps } from 'ts-mongoose';
import { UserSchema } from '../../../data';

export type User = ExtractProps<typeof UserSchema>;

export type CreateUserData = Omit<
  User,
  '_id' | 'createdAt' | 'updatedAt' | '__v'
>;

export type UserDetails = Omit<User, 'password' | '__v'>;
