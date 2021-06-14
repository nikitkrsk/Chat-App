import { Request, Response } from "express";

import AdminService from "../services/admin";
class AdminsController {
  /*

    Get All

  */
  static getAll = async (req: Request, res: Response) => {
    const { error, result } = await AdminService.getAllAdmins();
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
    const { error, result } = await AdminService.createAdmin(req.body);
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
  static updateAdmin = async (req: Request, res: Response) => {
    const { error, result } = await AdminService.updateAdmin(
      req.body,
      req.params.uuid,
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
