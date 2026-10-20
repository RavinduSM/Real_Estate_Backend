import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export default function signToken(userId: number): string {
  return jwt.sign({ id: userId }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'],
  });
}

