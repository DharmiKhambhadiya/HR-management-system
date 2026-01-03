import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import {
    registerSchema,
    loginSchema,
    verifyOTPSchema,
    changePasswordSchema,
    refreshTokenSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    bootstrapAdminSchema,
} from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

// Bootstrap first admin (HR) account
router.post(
    '/bootstrap-admin',
    validate(bootstrapAdminSchema),
    authController.bootstrapAdmin.bind(authController)
);

// Admin creates employee
router.post(
    '/register',
    authenticate,
    requireAdmin,
    validate(registerSchema),
    authController.register.bind(authController)
);

// Login - Step 1
router.post(
    '/login',
    validate(loginSchema),
    authController.login.bind(authController)
);

// Verify OTP - Step 2
router.post(
    '/verify-otp',
    validate(verifyOTPSchema),
    authController.verifyOTP.bind(authController)
);

// Change password
router.put(
    '/change-password',
    authenticate,
    validate(changePasswordSchema),
    authController.changePassword.bind(authController)
);

// Forgot password
router.post(
    '/forgot-password',
    validate(forgotPasswordSchema),
    authController.forgotPassword.bind(authController)
);

// Reset password
router.post(
    '/reset-password',
    validate(resetPasswordSchema),
    authController.resetPassword.bind(authController)
);

// Refresh token
router.post(
    '/refresh-token',
    validate(refreshTokenSchema),
    authController.refreshToken.bind(authController)
);

// Current user info
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
