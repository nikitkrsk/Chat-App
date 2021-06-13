import { Request, Response } from "express";

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
}

export default AuthController;
