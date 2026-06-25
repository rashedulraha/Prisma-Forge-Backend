import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const userRegister = async (req: Request, res: Response) => {
  try {
    const result = await userService.userRegistrationService(req.body);
    res.status(httpStatus.CREATED).json({ success: true, data: result });
  } catch (error) {
    const e = error as Error;
    res.status(httpStatus.CREATED).json({ success: false, data: e });
  }
};

export const userController = {
  userRegister,
};
