import { TypedRequest, TypedResponse, ControllerHandler } from '../../types/handler';
import { loginService, registerService } from '../../services/public/auth.service';
import { generateAndSendOtp, verifyOtp } from '../../services/public/otp.service';
import { AppDataSource } from '../../config/database';
import { CreateUserDTO } from '../../dtos/user.dto';
import { validationResult } from 'express-validator';
import { TokenResponse, LoginBody, AuthDataResponse, AuthDataResponseRegister } from '../../dtos/auth.dto';
import { AppError } from '../../utils/app-error';
import { User } from '../../entities/user.entity';
import { generateAccessToken, verifyRefreshToken } from '../../utils/jwt';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login: ControllerHandler = async (
    req: TypedRequest<{}, LoginBody>,
    res: TypedResponse<AuthDataResponse>,
    next
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Invalid email or password format', 400));
    }

    const { email, password } = req.body;
    const result = await loginService(email, password);

    if (!result) {
        return next(new AppError('Invalid email or password', 401));
    }

    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
        data: {
            accessToken: result.accessToken,
            refreshToken: '',
            user: {
                id: result.user.id,
                email: result.user.email,
                full_name: result.user.full_name,
                role: result.user.role,
            },
        },
    });
};

// ── Send OTP ──────────────────────────────────────────────────────────────────
export const sendOtpController: ControllerHandler = async (req, res, next) => {
    try {
        const { email, full_name } = req.body as { email?: string; full_name?: string };

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return next(new AppError('Invalid email address.', 400));
        }

        // Check if email already registered
        const userRepo = AppDataSource.getRepository(User);
        const existing = await userRepo.findOne({ where: { email: email.toLowerCase() } });
        if (existing) {
            return next(new AppError('This email is already registered. Please log in or use a different email.', 409));
        }

        await generateAndSendOtp(email, full_name || 'there');

        res.status(200).json({ message: `OTP code has been sent to ${email}. Please check your inbox.` });
    } catch (err) {
        next(err);
    }
};

// ── Verify OTP (standalone check, not consuming) ──────────────────────────────
export const verifyOtpController: ControllerHandler = async (req, res, next) => {
    try {
        const { email, otp } = req.body as { email?: string; otp?: string };

        if (!email || !otp) {
            return next(new AppError('Email and OTP code are required.', 400));
        }

        verifyOtp(email, otp); // throws AppError on failure

        res.status(200).json({ message: 'OTP is valid. You may proceed to complete registration.' });
    } catch (err) {
        next(err);
    }
};

// ── Register ──────────────────────────────────────────────────────────────────
export const registerController: ControllerHandler = async (
    req: TypedRequest<{}, CreateUserDTO>,
    res: TypedResponse<AuthDataResponseRegister>,
    next
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Validation failed: ' + errors.array().map(e => e.msg).join(', '), 400));
    }

    const result = await registerService(req.body);

    if (!result.success) {
        const statusCode = result.code === 'OTP_NOT_VERIFIED' ? 403
                         : result.code === 'EMAIL_EXISTS'     ? 409
                         : 400;
        return next(new AppError(result.message || 'Registration failed', statusCode));
    }

    // Set refresh token cookie — user is immediately logged in
    if (result.data?.refreshToken) {
        res.cookie('refreshToken', result.data.refreshToken, COOKIE_OPTIONS);
    }

    res.status(201).json({
        data: {
            accessToken: result.data!.accessToken,
            user: result.data!.user,
        },
    });
};

// ── Refresh access token ──────────────────────────────────────────────────────
export const refreshAccessToken: ControllerHandler = async (
    req: TypedRequest,
    res: TypedResponse<TokenResponse>
) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({
                data: { user: null, accessToken: '', refreshToken: '' },
                message: 'No refresh token provided',
            });
            return;
        }

        const payload = verifyRefreshToken(refreshToken);
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: payload.userId } });

        if (!user) {
            res.clearCookie('refreshToken', COOKIE_OPTIONS);
            res.status(401).json({
                data: { user: null, accessToken: '', refreshToken: '' },
                message: 'User not found',
            });
            return;
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                },
                accessToken: newAccessToken,
                refreshToken: '',
            },
        });
    } catch {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        res.status(401).json({
            data: { user: null, accessToken: '', refreshToken: '' },
            message: 'Refresh token is invalid or expired',
        });
    }
};

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout: ControllerHandler = async (req, res) => {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.status(204).send();
};
