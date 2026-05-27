import { AppDataSource } from "../../config/database";
import { User } from "../../entities/user.entity";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { CreateUserDTO } from "../../dtos/user.dto";
import { ServiceResult, AuthDataResponse } from "../../dtos/auth.dto";
import bcrypt from "bcrypt";
import { isEmailOtpVerified, consumeOtp } from "./otp.service";


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


export const registerService = async (
    userData: CreateUserDTO
): Promise<ServiceResult<AuthDataResponse>> => {
    try {
        const userRepo = AppDataSource.getRepository(User);

        // ── 1. Verify OTP was validated for this email ────────────────
        if (!isEmailOtpVerified(userData.email)) {
            return {
                success: false,
                message: 'Email not verified. Please verify your OTP before completing registration.',
                code: 'OTP_NOT_VERIFIED',
            };
        }

        // ── 2. Check email uniqueness ─────────────────────────────────
        const existingUser = await userRepo.findOne({
            where: { email: userData.email.toLowerCase() },
        });
        if (existingUser) {
            return {
                success: false,
                message: "Email address is already registered",
                code: "EMAIL_EXISTS",
            };
        }

        // ── 3. Hash password ──────────────────────────────────────────
        const passwordHash = await bcrypt.hash(userData.password, 12);

        // ── 4. Create user (otp field excluded from DB column) ────────
        const newUser = userRepo.create({
            email: userData.email.toLowerCase(),
            full_name: userData.full_name,
            password_hash: passwordHash,
            phoneNumber: userData.phoneNumber,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
        });

        const savedUser = await userRepo.save(newUser);

        // ── 5. Consume OTP (prevent reuse) ────────────────────────────
        consumeOtp(userData.email);

        const accessToken  = generateAccessToken(savedUser);
        const refreshToken = generateRefreshToken(savedUser);

        return {
            success: true,
            message: "Registration successful",
            data: {
                refreshToken,
                accessToken,
                user: {
                    id: savedUser.id,
                    email: savedUser.email,
                    full_name: savedUser.full_name,
                    role: savedUser.role,
                },
            },
        };
    } catch (error) {
        console.error("Register service error:", error);
        return {
            success: false,
            message: "An error occurred during registration",
            code: "REGISTRATION_ERROR",
        };
    }
};
