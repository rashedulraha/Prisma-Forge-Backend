import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/responseData";

//* user registration
const RegisterUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.userRegistrationService(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user register successfully",
      data: { user },
    });
  },
);

//* get profile me
const getProfileMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // res.send("Get my profile");
    const { access_token } = req.cookies;

    console.log("user request :", req.user);

    const profile = await userService;
  },
);
export const userController = {
  RegisterUser,
  getProfileMe,
};
