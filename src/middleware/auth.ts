import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });
  const parts = auth.split(" ");
  if (parts.length! == 2 || parts[0] !== "Bearer" || !parts[1])
    return res.status(401).json({ message: "Bearer format" });
  try {
    const payload = verifyToken(parts[1]);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: " Invalid token" });
  }
}
