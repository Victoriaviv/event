import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import type { StringValue } from 'ms'; // This is important

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'supersecretkey';

export const generateToken = (
  payload: string | object | Buffer,
  expiresIn: number | StringValue = '7d'
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};
