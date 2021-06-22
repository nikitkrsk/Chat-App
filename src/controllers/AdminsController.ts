import { Request, Response } from "express";

import AdminService from "../services/users";

import { IGetUserAuthInfoRequest, ROLES } from "../interfaces";

class AdminsController {
  /*

    Get All

  */
  static getAll = async (req: Request, res: Response) => {
    const { error, result } = await AdminService.getAllUsers(ROLES.USER);
    if (error) {
      return res.status(error.code).json({
        error: error.msg,
      });
    }
    return res
      .status(200)
      .json(result.map(({ password, ...keepAttrs }) => keepAttrs));
  };

   /*

    Get All

  */
    static getAllAdmins= async (req: Request, res: Response) => {
      const { error, result } = await AdminService.getAllUsers(ROLES.ADMIN);
      if (error) {
        return res.status(error.code).json({
          error: error.msg,
        });
      }
      return res
        .status(200)
        .json(result.map(({ password, ...keepAttrs }) => keepAttrs));
    };

  /*

    Create Admin

  */
  static createAdmin = async (req: Request, res: Response) => {
    const { error, result } = await AdminService.createUser(req.body, ROLES.ADMIN );
    if (error) {
      return res.status(error.code).json({
        error: error.msg,
      });
    }
    return res.status(200).json(result);
  };

  /*

    Update Admin

  */
  static updateAdmin = async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { error, result } = await AdminService.updateUser(
      req.body,
      req.uuid,
      req.app.get("socketService")
    );
    if (error) {
      return res.status(error.code).json({
        error: error.msg,
      });
    }
    return res.status(200).json(result);
  };
}

export default AdminsController;
