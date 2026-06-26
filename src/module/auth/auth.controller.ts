import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/responseData";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(payload);

    //* set cookie in user browser access token
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 24h or one day
    });

    //* set cookie in user browser refresh token
    res.cookie("refresh_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 24h or one day
    });

    //* response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user is login successfully",
      data: { accessToken, refreshToken },
    });
  },
);

export const authController = {
  loginUser,
};
