import type { AnySchema } from "yup";
import type { Request, Response, NextFunction } from "express";

export function validateBody(schema: AnySchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { stripUnknown: true });
      next();
    } catch (err: any) {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
  };
}
