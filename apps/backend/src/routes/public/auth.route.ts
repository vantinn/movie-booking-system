import { Router } from "express";
import * as authController from "../../controllers/public/auth.controller";
import { validateBody } from "../../middleware/validator.middleware";
import { LoginBody } from "../../dtos/auth.dto";
import { CreateUserDTO } from "../../dtos/user.dto";
import { body } from 'express-validator';

const router = Router();

router.post('/login',
    [
        body('email').isEmail(),
        body('password').isString().isLength({ min: 8, max: 100 }),
    ],
    validateBody(LoginBody),
    authController.login
);

router.post('/register',
    [
        body('full_name').isString().isLength({ min: 1, max: 100 }),
        body('email').isEmail(),
        body('password').isString().isLength({ min: 8, max: 100 }),
        body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    ],
    validateBody(CreateUserDTO),
    authController.registerController
);

router.post('/logout', authController.logout);

router.post('/refresh', authController.refreshAccessToken);

router.post('/send-otp', authController.sendOtpController);

router.post('/verify-otp', authController.verifyOtpController);

export default router;
