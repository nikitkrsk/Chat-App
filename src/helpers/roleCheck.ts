import { Request, Response, NextFunction } from "express";

import { IGetUserAuthInfoRequest } from "../interfaces";

/**
 * Middleware to check if user has certain roles.
 *
 * Example uses user object in session. Get roles and compare them with roles of api fn.
 *
 * @param {array} roles
 */
export const hasRoles = (roles) => {
  return (
    hasRoles[roles] ||
    (hasRoles[roles] = (
      req: IGetUserAuthInfoRequest,
      res: Response,
      next: NextFunction
    ) => {
      let isAllowed = false;
      const userRole = req.role;

      roles.forEach((role) => {
        if (role === userRole) {
          isAllowed = true;
        }
      });

      if (!isAllowed) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        next();
      }
    })
  );
};
