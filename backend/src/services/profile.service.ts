import mongoose from 'mongoose';
import { User, Employee } from '../models';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { Role } from '../types';
import cloudinary from '../config/cloudinary';

export class ProfileService {
    /**
     * Get user profile
     */
    async getProfile(userId: string, requestingUserId: string, requestingUserRole: Role) {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Check permissions: employees can only view their own profile
        if (requestingUserRole === Role.EMPLOYEE && userId !== requestingUserId) {
            throw new ForbiddenError('You can only view your own profile');
        }

        const employee = await Employee.findOne({ userId: user._id }).populate({
            path: 'managerId',
            populate: { path: 'userId' },
        });

        // Split name into firstName and lastName for backward compatibility
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
            personal: {
                id: user._id.toString(),
                firstName,
                lastName,
                name: user.name,
                email: user.email,
                phone: employee?.phone,
                dateOfBirth: employee?.dateOfBirth,
                gender: employee?.gender,
                maritalStatus: employee?.maritalStatus,
                nationality: employee?.nationality,
                address: employee?.address,
            },
            professional: {
                employeeCode: employee?.employeeCode,
                company: employee?.company,
                department: employee?.department,
                jobPosition: employee?.jobPosition,
                manager: employee?.managerId ? {
                    id: ((employee.managerId as any).userId as any)?._id?.toString() || (employee.managerId as any)._id?.toString(),
                    name: ((employee.managerId as any).userId as any)?.name || '',
                    email: ((employee.managerId as any).userId as any)?.email || '',
                } : null,
                location: employee?.location,
                dateOfJoining: employee?.dateOfJoining,
                workSchedule: {
                    workingDays: employee?.workingDays,
                    dailyHours: employee?.dailyHours,
                    breakTime: employee?.breakTime,
                },
            },
            bank: {
                accountNumber: employee?.accountNumber,
                bankName: employee?.bankName,
                ifscCode: employee?.ifscCode,
                panNumber: employee?.panNumber,
                uanNumber: employee?.uanNumber,
            },
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(
        userId: string,
        requestingUserId: string,
        requestingUserRole: Role,
        data: any
    ) {
        // Check permissions
        if (requestingUserRole === Role.EMPLOYEE && userId !== requestingUserId) {
            throw new ForbiddenError('You can only update your own profile');
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const employee = await Employee.findOne({ userId: user._id });

        // Define allowed fields based on role
        const employeeAllowedFields = ['phone', 'address'];
        const hrAllowedFields = [
            'name', 'email', 'phone', 'address',
            'department', 'jobPosition', 'monthlyWage', 'dateOfBirth',
            'gender', 'maritalStatus', 'nationality', 'location',
            'accountNumber', 'bankName', 'ifscCode', 'panNumber', 'uanNumber',
        ];

        const allowedFields = requestingUserRole === Role.HR ? hrAllowedFields : employeeAllowedFields;

        // Filter data based on permissions
        const filteredData: any = {};
        const employeeData: any = {};

        for (const [key, value] of Object.entries(data)) {
            // Skip empty strings and null values (but allow 0 and false)
            if (value === '' || value === null || value === undefined) {
                continue;
            }

            if (allowedFields.includes(key)) {
                if (['name', 'email'].includes(key)) {
                    filteredData[key] = value;
                } else if (key === 'dateOfBirth' && value) {
                    // Convert date string to Date
                    employeeData[key] = new Date(value as string);
                } else {
                    employeeData[key] = value;
                }
            }
        }

        // Update user and employee
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (Object.keys(filteredData).length > 0) {
                await User.findByIdAndUpdate(userId, filteredData, { session });
            }

            if (Object.keys(employeeData).length > 0 && employee) {
                await Employee.findByIdAndUpdate(employee._id, employeeData, { session });
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        // Fetch updated user with employee data
        const updatedUser = await User.findById(userId);

        if (!updatedUser) {
            throw new NotFoundError('User not found after update');
        }

        const updatedEmployee = await Employee.findOne({ userId: updatedUser._id }).populate({
            path: 'managerId',
            populate: { path: 'userId' },
        });

        // Split name for backward compatibility
        const nameParts = updatedUser.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Return updated profile in the same format as getProfile
        return {
            personal: {
                id: updatedUser._id.toString(),
                firstName,
                lastName,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedEmployee?.phone,
                dateOfBirth: updatedEmployee?.dateOfBirth,
                gender: updatedEmployee?.gender,
                maritalStatus: updatedEmployee?.maritalStatus,
                nationality: updatedEmployee?.nationality,
                address: updatedEmployee?.address,
            },
            professional: {
                employeeCode: updatedEmployee?.employeeCode,
                company: updatedEmployee?.company,
                department: updatedEmployee?.department,
                jobPosition: updatedEmployee?.jobPosition,
                manager: updatedEmployee?.managerId ? {
                    id: ((updatedEmployee.managerId as any).userId as any)?._id?.toString() || (updatedEmployee.managerId as any)._id?.toString(),
                    name: ((updatedEmployee.managerId as any).userId as any)?.name || '',
                    email: ((updatedEmployee.managerId as any).userId as any)?.email || '',
                } : null,
                location: updatedEmployee?.location,
                dateOfJoining: updatedEmployee?.dateOfJoining,
                workSchedule: {
                    workingDays: updatedEmployee?.workingDays,
                    dailyHours: updatedEmployee?.dailyHours,
                    breakTime: updatedEmployee?.breakTime,
                },
            },
            bank: {
                accountNumber: updatedEmployee?.accountNumber,
                bankName: updatedEmployee?.bankName,
                ifscCode: updatedEmployee?.ifscCode,
                panNumber: updatedEmployee?.panNumber,
                uanNumber: updatedEmployee?.uanNumber,
            },
        };
    }

    /**
     * Upload profile picture
     */
    async uploadProfilePicture(userId: string, file: Express.Multer.File) {
        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
                folder: 'hrms/profiles',
                public_id: `profile_${userId}`,
                overwrite: true,
            }
        );

        // Note: User model no longer has profilePicUrl field
        // You may want to store this in EmployeeProfile or a separate model
        // For now, we'll skip this or you can add the field back to User model if needed

        return { profilePicUrl: result.secure_url, message: 'Profile picture uploaded. Note: User model structure has changed.' };
    }
}
