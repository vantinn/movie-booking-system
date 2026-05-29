import { AppDataSource } from "../../config/database";
import { User } from "../../entities/user.entity";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { CreateUserDTO } from "../../dtos/user.dto";
import { AuthDataResponse } from "../../dtos/auth.dto";
import bcrypt from "bcrypt";
import { isEmailOtpVerified, consumeOtp } from "./otp.service";
import { AppError } from "../../utils/app-error";


export const loginService = async (email: string, password: string) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { accessToken, refreshToken, user };
};


export const registerService = async (userData: CreateUserDTO): Promise<AuthDataResponse> => {
    const userRepo = AppDataSource.getRepository(User);

    if (!isEmailOtpVerified(userData.email)) {
        throw new AppError('Email not verified. Please verify your OTP before completing registration.', 403);
    }

    const existingUser = await userRepo.findOne({
        where: { email: userData.email.toLowerCase() },
    });
    if (existingUser) {
        throw new AppError('Email address is already registered', 409);
    }

    const passwordHash = await bcrypt.hash(userData.password, 12);

    const newUser = userRepo.create({
        email: userData.email.toLowerCase(),
        full_name: userData.full_name,
        password_hash: passwordHash,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
    });

    const savedUser = await userRepo.save(newUser);

    consumeOtp(userData.email);

    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    return {
        refreshToken,
        accessToken,
        user: {
            id: savedUser.id,
            email: savedUser.email,
            full_name: savedUser.full_name,
            role: savedUser.role,
        },
    };
};
