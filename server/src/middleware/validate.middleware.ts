import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { fail } from "../utils/apiResponse";

/**
 * Validates req.body / req.query / req.params against a Zod schema.
 * Usage: router.post("/", validate(createTeamSchema), controller.create)
 */
export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body ?? req.body;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return fail(res, "بيانات غير صالحة", 422, errors);
      }
      next(err);
    }
  };
}
