import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const userRegister = async (req: Request, res: Response) => {
  try {
    const result = await userService.userRegistrationService(req.body);
    res.status(httpStatus.CREATED).json({ success: true, data: result });
  } catch (error) {
    // console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      data: "User already exist",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  userRegister,
};
