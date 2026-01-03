import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, Employee, OTP, RefreshToken } from '../models';
import { generateLoginId, generatePassword, generateOTP } from '../utils/helpers';
import { sendWelcomeEmail, sendOTPEmail, sendPasswordResetEmail } from '../utils/email';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors';
import { JWTPayload, Role } from '../types';

export class AuthService {
    /**
     * Register new employee (HR only)
     */
    async register(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        role?: Role;
        company: string;
        department: string;
        managerId?: string;
        location?: string;
        jobPosition?: string;
        dateOfJoining: string;
        monthlyWage?: number;
    }) {
        // Check if email already exists
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Generate login ID (for reference, not stored in User model)
        const year = new Date().getFullYear();
        const count = await User.countDocuments();
        const serial = count + 1;
        const loginId = generateLoginId(data.firstName, data.lastName, year, serial);

        // Generate temporary password
        const tempPassword = generatePassword();
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        // Combine firstName and lastName into name
        const fullName = `${data.firstName} ${data.lastName}`;

        // Generate employee code
        const employeeCount = await Employee.countDocuments();
        const employeeCode = `EMP${(employeeCount + 1).toString().padStart(3, '0')}`;

        // Create user and employee in transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newUser = await User.create([{
                name: fullName,
                email: data.email,
                passwordHash,
                role: data.role || Role.EMPLOYEE,
                isActive: true,
            }], { session });

            const user = newUser[0];

            await Employee.create([{
                userId: user._id,
                employeeCode,
                company: data.company,
                department: data.department,
                jobPosition: data.jobPosition,
                managerId: data.managerId ? new mongoose.Types.ObjectId(data.managerId) : undefined,
                location: data.location || 'Remote',
                dateOfJoining: new Date(data.dateOfJoining),
                phone: data.phone || '',
                monthlyWage: typeof data.monthlyWage === 'number' ? data.monthlyWage : 0,
            }], { session });

            await session.commitTransaction();

            // Send welcome email (using firstName for email)
            await sendWelcomeEmail(data.email, data.firstName, loginId, tempPassword);

            return {
                employeeId: employeeCode,
                loginId,
                tempPassword,
                email: data.email,
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Login - Step 1: Verify credentials. OTP is optional and disabled by default for UI integration.
     */
    async login(identifier: string, password: string) {
        const user = await this.findUserByIdentifier(identifier);

        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const employee = await Employee.findOne({ userId: user._id });
        const otpEnabled = process.env.AUTH_ENABLE_OTP === 'true';

        if (!otpEnabled) {
            await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

            const accessToken = this.generateAccessToken(user as any);
            const refreshToken = await this.generateRefreshToken(user._id.toString());

            return {
                requiresOTP: false,
                accessToken,
                refreshToken,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    employeeCode: employee?.employeeCode,
                },
            };
        }

        // Generate OTP
        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5') * 60 * 1000);

        // Store OTP
        await OTP.create({
            userId: user._id,
            otpHash,
            expiresAt,
        });

        // Extract first name from user.name
        const firstName = user.name.split(' ')[0] || user.name;

        // Send OTP email
        await sendOTPEmail(user.email, otp, firstName);

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

        // Generate temporary token for OTP verification
        const tempToken = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: '10m' }
        );

        return {
            requiresOTP: true,
            tempToken,
        };
    }

    /**
     * Login - Step 2: Verify OTP and issue tokens
     */
    async verifyOTP(userId: string, otp: string) {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Find valid OTP
        const otpRecord = await OTP.findOne({
            userId: user._id,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            throw new UnauthorizedError('Invalid or expired OTP');
        }

        const isOTPValid = await bcrypt.compare(otp, otpRecord.otpHash);
        if (!isOTPValid) {
            throw new UnauthorizedError('Invalid OTP');
        }

        // Mark OTP as used
        await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

        // Generate tokens
        const accessToken = this.generateAccessToken(user as any);
        const refreshToken = await this.generateRefreshToken(user._id.toString());

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name,
            },
        };
    }

    /**
     * Change password
     */
    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Current password is incorrect');
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, {
            passwordHash: newPasswordHash,
        });
    }

    /**
     * Forgot password - Send reset token to email
     */
    async forgotPassword(email: string) {
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists for security
            return { message: 'If the email exists, a password reset link has been sent.' };
        }

        // Generate reset token (JWT)
        const resetToken = jwt.sign(
            { userId: user._id.toString(), email: user.email, type: 'password_reset' },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRY || '1h' } as any
        );

        // Extract first name from user.name
        const firstName = user.name.split(' ')[0] || user.name;

        // Send password reset email
        await sendPasswordResetEmail(email, resetToken, firstName);

        return { message: 'If the email exists, a password reset link has been sent.' };
    }

    /**
     * Reset password - Verify token and reset password
     */
    async resetPassword(resetToken: string, newPassword: string) {
        try {
            // Verify reset token
            const decoded = jwt.verify(resetToken, process.env.JWT_ACCESS_SECRET!) as {
                userId: string;
                email: string;
                type: string;
            };

            if (decoded.type !== 'password_reset') {
                throw new UnauthorizedError('Invalid reset token');
            }

            const user = await User.findById(decoded.userId);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            // Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            // Update password
            await User.findByIdAndUpdate(user._id, {
                passwordHash: newPasswordHash,
            });

            return { message: 'Password reset successfully' };
        } catch (error: any) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw new UnauthorizedError('Invalid or expired reset token');
            }
            throw error;
        }
    }

    /**
     * Get current user profile (minimal data for UI bootstrap)
     */
    async getCurrentUser(userId: string) {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const employee = await Employee.findOne({ userId: user._id });

        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
            employeeCode: employee?.employeeCode,
        };
    }

    /**
     * Bootstrap first HR/Admin account when none exists
     */
    async bootstrapAdmin(data: { firstName: string; lastName: string; email: string; password: string }) {
        const hrExists = await User.exists({ role: Role.HR });

        if (hrExists) {
            throw new ConflictError('An admin/HR account already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const fullName = `${data.firstName} ${data.lastName}`.trim();

        const user = await User.create({
            name: fullName,
            email: data.email,
            passwordHash,
            role: Role.HR,
            isActive: true,
        });

        const accessToken = this.generateAccessToken(user as any);
        const refreshToken = await this.generateRefreshToken(user._id.toString());

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name,
            },
        };
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken: string) {
        const tokenRecord = await RefreshToken.findOne({ token: refreshToken });

        if (!tokenRecord) {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        const user = await User.findById(tokenRecord.userId);

        if (!user || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        const accessToken = this.generateAccessToken(user);

        return { accessToken };
    }

    /**
     * Resolve user by email or employee code
     */
    private async findUserByIdentifier(identifier: string) {
        const normalized = (identifier || '').trim();

        if (!normalized) {
            return null;
        }

        // Try email first
        if (normalized.includes('@')) {
            const userByEmail = await User.findOne({ email: normalized.toLowerCase() });
            if (userByEmail) return userByEmail;
        }

        // Then try employee code
        const employee = await Employee.findOne({ employeeCode: normalized.toUpperCase() });
        if (employee) {
            const user = await User.findById(employee.userId);
            if (user) return user;
        }

        return null;
    }

    /**
     * Generate access token
     */
    private generateAccessToken(user: { _id: mongoose.Types.ObjectId; email: string; role: any }): string {
        const payload: JWTPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
        } as any);
    }

    /**
     * Generate refresh token
     */
    private async generateRefreshToken(userId: string): Promise<string> {
        const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
        } as any);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await RefreshToken.create({
            userId: new mongoose.Types.ObjectId(userId),
            token,
            expiresAt,
        });

        return token;
    }
}
