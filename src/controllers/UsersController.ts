import { Request, Response } from "express";

import UserServoce from "../services/users";
import { IGetUserAuthInfoRequest, ROLES } from "../interfaces";

class UsersController {
  /*

    Create User

  */
  static createUser = async (req: Request, res: Response) => {
    const { error, result } = await UserServoce.createUser(
      req.body,
      ROLES.USER
    );
    if (error) {
      return res.status(error.code).json({
        error: error.msg,
      });
    }
    return res.status(200).json(result);
  };

  /*

    Update User

  */
  static updateUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { error, result } = await UserServoce.updateUser(
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

export default UsersController;
