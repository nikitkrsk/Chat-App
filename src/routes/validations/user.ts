import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { validateRequest } from ".";

export const createNewUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema: Joi.ObjectSchema<any> = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).max(150).required(),
    phone: Joi.string().min(2).max(250).allow(null),
    firstName: Joi.string().min(2).max(50).required(),
    username: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
  });
  validateRequest(req, res, next, schema);
};

export const updateUserSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema: Joi.ObjectSchema<any> = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(1).max(150),
    phone: Joi.string().min(2).max(250),
    firstName: Joi.string().min(2).max(50),
    username: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
  });
  validateRequest(req, res, next, schema);
};
