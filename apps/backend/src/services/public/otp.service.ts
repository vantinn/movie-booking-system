import crypto from 'crypto';
import { sendOtpEmail } from '../email/email.service';
import { AppError } from '../../utils/app-error';

interface OtpEntry {
    code: string;
    expiresAt: number;
    attempts: number;
    verified: boolean;
}

interface RateLimitEntry {
    count: number;
    windowStart: number;
}

const otpStore = new Map<string, OtpEntry>();
const rateLimit = new Map<string, RateLimitEntry>();

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

setInterval(() => {
    const now = Date.now();
    for (const [email, entry] of otpStore) {
        if (entry.expiresAt < now) otpStore.delete(email);
    }
    for (const [email, rl] of rateLimit) {
        if (rl.windowStart + RATE_LIMIT_WINDOW < now) rateLimit.delete(email);
    }
}, 5 * 60 * 1000);

function generateCode(): string {
    return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function checkRateLimit(email: string): void {
    const now = Date.now();
    const rl = rateLimit.get(email);

    if (!rl || now - rl.windowStart > RATE_LIMIT_WINDOW) {
        rateLimit.set(email, { count: 1, windowStart: now });
        return;
    }

    if (rl.count >= RATE_LIMIT_MAX) {
        const waitMin = Math.ceil((RATE_LIMIT_WINDOW - (now - rl.windowStart)) / 60_000);
        throw new AppError(
            `Too many OTP requests. Please try again in ${waitMin} minute(s).`,
            429
        );
    }

    rl.count++;
}

export async function generateAndSendOtp(
    email: string,
    fullName: string = 'there'
): Promise<void> {
    const normalised = email.toLowerCase().trim();

    checkRateLimit(normalised);

    const code = generateCode();
    otpStore.set(normalised, {
        code,
        expiresAt: Date.now() + OTP_TTL_MS,
        attempts: 0,
        verified: false,
    });

    await sendOtpEmail(normalised, code, fullName);
}

export function verifyOtp(email: string, code: string): true {
    const normalised = email.toLowerCase().trim();
    const entry = otpStore.get(normalised);

    if (!entry) {
        throw new AppError('OTP is invalid or has expired. Please request a new code.', 400);
    }

    if (entry.verified) {
        throw new AppError('This OTP has already been used. Please register again.', 400);
    }

    if (Date.now() > entry.expiresAt) {
        otpStore.delete(normalised);
        throw new AppError('OTP has expired. Please click "Resend code".', 400);
    }

    if (entry.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(normalised);
        throw new AppError('Too many failed attempts. Please click "Resend code" to receive a new OTP.', 400);
    }

    if (entry.code !== code.trim()) {
        entry.attempts++;
        const remaining = MAX_ATTEMPTS - entry.attempts;
        throw new AppError(
            `Incorrect OTP. You have ${remaining} attempt(s) remaining.`,
            400
        );
    }

    entry.verified = true;
    return true;
}

export function isEmailOtpVerified(email: string): boolean {
    const normalised = email.toLowerCase().trim();
    const entry = otpStore.get(normalised);
    return !!(entry && entry.verified && Date.now() <= entry.expiresAt);
}

export function consumeOtp(email: string): void {
    otpStore.delete(email.toLowerCase().trim());
}
