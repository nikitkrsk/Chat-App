import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { validateRequest } from ".";

export const createNewAdminSchema = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema: Joi.ObjectSchema<any> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(1).max(150).required(),
      phone: Joi.string().min(2).max(250).allow(null),
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      role: Joi.string().min(2).max(50).required(),
      contactInfo: Joi.object()
    });
    validateRequest(req, res, next, schema);
  };