import jwt from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
  userId: number;
  phone: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}
