import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { validateRequest } from ".";

export const siginInSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema: Joi.ObjectSchema<any> = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
};

export const destroySchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema: Joi.ObjectSchema<any> = Joi.object({
    uuid: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
};
