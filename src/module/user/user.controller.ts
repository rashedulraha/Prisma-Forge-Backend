import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { TResponseData } from "./user.interfaces";

// response data.
export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};

//* register user
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

export const userController = {
  RegisterUser,
};
