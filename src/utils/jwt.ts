import * as jwt from "jsonwebtoken";

const SECRET: string = (Bun.env.JWT_SECRET ??
  process.env.JWT_SECRET ??
  "thekey") as string;

export function signToken(payload: object, expiresIn: string = "1h"): string {
  return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
