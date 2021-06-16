import Joi from "joi";
import { NextFunction, Request, Response } from "express";
export * from "./user";
export * from "./auth"

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: Joi.ObjectSchema<any>
) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: false, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    return res.status(400).json({
      error: `${error.details.map((x) => x.message).join(", ")}`,
    });
  } else {
    req.body = value;
    next();
  }
};
export const emptySchema = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema: Joi.ObjectSchema<any> = Joi.object({});
    validateRequest(req, res, next, schema);
  };

