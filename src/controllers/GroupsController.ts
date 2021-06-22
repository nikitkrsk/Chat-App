import { Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../interfaces";

import GroupService from "../services/groups";

class GroupsController {
    /*

    Get All

  */
    static getAll = async (req: IGetUserAuthInfoRequest, res: Response) => {
      const { error, result } = await GroupService.getAll(req.uuid);
      if (error) {
        return res.status(error.code).json({
          error: error.msg,
        });
      }
      return res
        .status(200)
        .json(result);
    };
}

export default GroupsController;
