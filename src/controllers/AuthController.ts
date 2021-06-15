import { Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../interfaces";

import AuthService from "../services/auth";
class AuthController {
  /*

    Signin

  */
  static siginin = async (req: Request, res: Response) => {
    const { error, result } = await AuthService.signin(req.body);
    if (error) {
      return res.status(error.code).json({
        error: error.msg,
      });
    }
    return res.status(200).json(result);
  };

  /*

    Get All Self Sessions

  */
    static selfSessions = async (req: IGetUserAuthInfoRequest, res: Response) => {
      const { error, result } = await AuthService.selfSessions(req.uuid);
      if (error) {
        return res.status(error.code).json({
          error: error.msg,
        });
      }
      return res.status(200).json(result);
    };

  /*

    Destroy Own Sessions

  */
  static destroySelf = async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { error, result } = await AuthService.selfDestroySession({
      uuid: req.uuid,
      sessionId: req.body.uuid,
    });
    if (error) {
      return res.status(error.code).json({
        error: error.msg,
      });
    }
    return res.status(200).json(result);
  };

  /*

    Admin Can Destroy Any Session

  */
  static adminDestroy = async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { error, result } = await AuthService.adminDestroySessions({
      sessionId: req.body.uuid,
    });
    if (error) {
      return res.status(error.code).json({
        error: error.msg,
      });
    }
    return res.status(200).json(result);
  };
}

export default AuthController;
