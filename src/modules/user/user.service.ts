import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/sendEmail";
import verificationCodeTemplate from "../../utils/verificationCodeTemplate";
import { createToken } from "../../utils/tokenGenerate";
import config from "../../config";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";

const registerUser = async (payload: IUser) => {
  const existingUser = await User.isUserExistByEmail(payload.email);
  if (existingUser && existingUser.isVerified) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }

  if (payload.role === "admin") {
    throw new AppError("You can't register as admin", StatusCodes.BAD_REQUEST);
  }

  // Password check
  if (payload.password.length < 6) {
    throw new AppError(
      "Password must be at least 6 characters long",
      StatusCodes.BAD_REQUEST
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  let result: IUser;

  // Case 2: exists but not verified → update OTP
  if (existingUser && !existingUser.isVerified) {
    result = (await User.findOneAndUpdate(
      { email: existingUser.email },
      { otp: hashedOtp, otpExpires },
      { new: true }
    )) as IUser;
  } else {
    // Case 3: new user
    result = await User.create({
      ...payload,
      otp: hashedOtp,
      otpExpires,
      isVerified: false,
    });
  }

  // Send email
  await sendEmail({
    to: result.email,
    subject: "Verify your email",
    html: verificationCodeTemplate(otp),
  });

  // JWT payload
  const JwtToken = {
    userId: result._id,
    email: result.email,
    role: result.role,
  };

  const accessToken = createToken(
    JwtToken,
    config.JWT_SECRET as string,
    config.JWT_EXPIRES_IN as string
  );

  const refreshToken = createToken(
    JwtToken,
    config.refreshTokenSecret as string,
    config.jwtRefreshTokenExpiresIn as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
    },
  };
};

const verifyEmail = async (email: string, payload: string) => {
  const { otp }: any = payload;
  if (!otp) throw new Error("OTP is required");

  const existingUser = await User.findOne({ email });
  if (!existingUser)
    throw new AppError("User not found", StatusCodes.NOT_FOUND);

  // if (!existingUser.otp || !existingUser.otpExpires) {
  //   throw new AppError("OTP not requested or expired", StatusCodes.BAD_REQUEST);
  // }
  if (!existingUser.otp || !existingUser.otpExpires) {
    throw new AppError("OTP somoy sasee, abar denn", StatusCodes.BAD_REQUEST);
  }

  if (existingUser.otpExpires < new Date()) {
    throw new AppError("OTP has expired", StatusCodes.BAD_REQUEST);
  }

  if (existingUser.isVerified === true) {
    throw new AppError("User already verified", StatusCodes.CONFLICT);
  }

  const isOtpMatched = await bcrypt.compare(otp.toString(), existingUser.otp);
  if (!isOtpMatched) throw new AppError("Invalid OTP", StatusCodes.BAD_REQUEST);

  const result = await User.findOneAndUpdate(
    { email },
    {
      isVerified: true,
      $unset: { otp: "", otpExpires: "" },
    },
    { new: true }
  ).select("username email role");
  return result;
};

const resendOtpCode = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser)
    throw new AppError("User not found", StatusCodes.NOT_FOUND);

  if (existingUser.isVerified === true) {
    throw new AppError("User already verified", StatusCodes.CONFLICT);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const result = await User.findOneAndUpdate(
    { email },
    {
      otp: hashedOtp,
      otpExpires,
    },
    { new: true }
  ).select("username email role");

  await sendEmail({
    to: existingUser.email,
    subject: "Verify your email",
    html: verificationCodeTemplate(otp),
  });
  return result;
};

const getAllUsers = async () => {
  const result = await User.find().select(
    "username firstName lastName email role"
  );
  return result;
};

const getAdminId = async () => {
  const admin = await User.findOne({ role: "admin" }).select("_id");
  return admin;
};

const getMyProfile = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser)
    throw new AppError("User not found", StatusCodes.NOT_FOUND);

  const result = await User.findOne({ email }).select(
    "-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires"
  );

  return result;
};

const updateUserProfile = async (payload: any, email: string, file: any) => {
  const user = await User.findOne({ email }).select("image");
  if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

  // eslint-disable-next-line prefer-const
  let updateData: any = { ...payload };
  let oldImagePublicId: string | undefined;

  if (file) {
    const uploadResult = await uploadToCloudinary(file.path, "users");
    oldImagePublicId = user.image?.public_id;

    updateData.image = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  const result = await User.findOneAndUpdate({ email }, updateData, {
    new: true,
  });

  if (file && oldImagePublicId) {
    await deleteFromCloudinary(oldImagePublicId);
  }

  return result;
};

const userService = {
  registerUser,
  verifyEmail,
  resendOtpCode,
  getAllUsers,
  getMyProfile,
  updateUserProfile,
  getAdminId,
};

export default userService;
