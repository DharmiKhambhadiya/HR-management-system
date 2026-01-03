import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        firstName: z.string({ required_error: 'First name is required' }).min(2, 'First name must be at least 2 characters'),
        lastName: z.string({ required_error: 'Last name is required' }).min(2, 'Last name must be at least 2 characters'),
        email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
        phone: z
            .string()
            .regex(/^\+?[1-9]\d{9,14}$/,
                'Invalid phone number')
            .optional(),
        role: z.enum(['HR', 'EMPLOYEE'], { required_error: 'Role is required' }).default('EMPLOYEE'),
        company: z.string({ required_error: 'Company is required' }).min(2, 'Company name is required'),
        department: z.string({ required_error: 'Department is required' }).min(2, 'Department is required'),
        managerId: z.string().optional(),
        location: z.string().min(2, 'Location is required').optional(),
        jobPosition: z.string().min(2, 'Job position is required').optional(),
        dateOfJoining: z.string({ required_error: 'Date of joining is required' }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        monthlyWage: z.number().nonnegative('Monthly wage must be positive').optional(),
    }),
});

export const loginSchema = z
    .object({
        body: z
            .object({
                identifier: z.string().trim().min(1, 'Email or employee code is required').optional(),
                email: z.string().email('Invalid email format').optional(),
                password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
            })
            .refine((data) => !!data.identifier || !!data.email, {
                message: 'Email or employee code is required',
                path: ['identifier'],
            }),
    });

export const bootstrapAdminSchema = z.object({
    body: z.object({
        firstName: z.string({ required_error: 'First name is required' }).min(2, 'First name must be at least 2 characters'),
        lastName: z.string({ required_error: 'Last name is required' }).min(2, 'Last name must be at least 2 characters'),
        email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    }),
});

export const verifyOTPSchema = z.object({
    body: z.object({
        otp: z.string({ required_error: 'OTP is required' }).length(6, 'OTP must be 6 digits'),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old password is required' }).min(1, 'Old password is required'),
        newPassword: z.string({ required_error: 'New password is required' })
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string({ required_error: 'Refresh token is required' }).min(1, 'Refresh token is required'),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        resetToken: z.string({ required_error: 'Reset token is required' }).min(1, 'Reset token is required'),
        newPassword: z.string({ required_error: 'New password is required' })
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    }),
});
