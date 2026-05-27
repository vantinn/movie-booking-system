/**
 * OTP Service — In-memory OTP store
 * ──────────────────────────────────
 * Manages 6-digit OTP codes for email verification.
 *
 * Security properties:
 *  - OTP expires after 10 minutes
 *  - Max 5 failed verification attempts per code (brute-force protection)
 *  - Max 3 OTP sends per email per hour (rate limiting)
 *  - Codes are single-use (invalidated after successful verify)
 *  - Auto-cleanup of expired entries every 5 minutes
 */

import crypto from 'crypto';
import { sendOtpEmail } from '../email/email.service';
import { AppError } from '../../utils/app-error';

// ── Types ─────────────────────────────────────────────────────────────────────

interface OtpEntry {
    code: string;
    expiresAt: number;       // Unix ms
    attempts: number;        // Failed verify attempts
    verified: boolean;       // Consumed by a successful register
}

interface RateLimitEntry {
    count: number;
    windowStart: number;     // Unix ms — start of the 1-hour window
}

// ── Stores ────────────────────────────────────────────────────────────────────

const otpStore   = new Map<string, OtpEntry>();      // key: email
const rateLimit  = new Map<string, RateLimitEntry>(); // key: email

const OTP_TTL_MS         = 10 * 60 * 1000;  // 10 minutes
const MAX_ATTEMPTS       = 5;
const RATE_LIMIT_MAX     = 3;                // max sends per window
const RATE_LIMIT_WINDOW  = 60 * 60 * 1000;  // 1 hour

// ── Auto-cleanup (every 5 min) ────────────────────────────────────────────────

setInterval(() => {
    const now = Date.now();
    for (const [email, entry] of otpStore) {
        if (entry.expiresAt < now) otpStore.delete(email);
    }
    for (const [email, rl] of rateLimit) {
        if (rl.windowStart + RATE_LIMIT_WINDOW < now) rateLimit.delete(email);
    }
}, 5 * 60 * 1000);

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateCode(): string {
    // Crypto-random 6-digit number (zero-padded)
    return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function checkRateLimit(email: string): void {
    const now = Date.now();
    const rl  = rateLimit.get(email);

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

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate a new OTP for `email`, persist it, and send the email.
 * Rate-limited: max 3 sends per email per hour.
 */
export async function generateAndSendOtp(
    email: string,
    fullName: string = 'there'
): Promise<void> {
    const normalised = email.toLowerCase().trim();

    // Rate-limit check (throws if exceeded)
    checkRateLimit(normalised);

    const code = generateCode();
    otpStore.set(normalised, {
        code,
        expiresAt: Date.now() + OTP_TTL_MS,
        attempts: 0,
        verified: false,
    });

    // Send email (throws on SMTP failure)
    await sendOtpEmail(normalised, code, fullName);
}

/**
 * Verify an OTP code for `email`.
 * On success the entry is marked `verified` (single-use).
 * Returns `true` or throws an AppError with a specific message.
 */
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

    // ✅ Correct — mark as verified but keep in store so register can confirm
    entry.verified = true;
    return true;
}

/**
 * Check if email has a valid, verified (but not yet consumed) OTP.
 * Called by registerService to confirm OTP was validated.
 */
export function isEmailOtpVerified(email: string): boolean {
    const normalised = email.toLowerCase().trim();
    const entry = otpStore.get(normalised);
    return !!(entry && entry.verified && Date.now() <= entry.expiresAt);
}

/**
 * Consume (delete) the OTP entry after successful registration.
 * Prevents the same OTP from being reused if registration fails and retries.
 */
export function consumeOtp(email: string): void {
    otpStore.delete(email.toLowerCase().trim());
}
