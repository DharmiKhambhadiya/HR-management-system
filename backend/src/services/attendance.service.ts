import mongoose from 'mongoose';
import { User, Employee, Attendance } from '../models';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AttendanceStatus, Role } from '../types';
import { formatDate, getMonthDateRange } from '../utils/helpers';

export class AttendanceService {
    /**
     * Check in
     */
    async checkIn(userId: string, location: { latitude: number; longitude: number }, deviceInfo?: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const existing = await Attendance.findOne({
            userId: user._id,
            date: { $gte: today },
        });

        if (existing && existing.checkIn) {
            throw new ValidationError('Already checked in today');
        }

        const attendance = await Attendance.create({
            userId: user._id,
            date: new Date(),
            checkIn: new Date(),
            status: AttendanceStatus.PRESENT,
        });

        return {
            checkInTime: attendance.checkIn!.toISOString(),
            attendanceId: attendance._id.toString(),
        };
    }

    /**
     * Check out
     */
    async checkOut(userId: string, attendanceId: string, location: { latitude: number; longitude: number }) {
        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            throw new NotFoundError('Attendance record not found');
        }

        if (attendance.userId.toString() !== userId) {
            throw new ValidationError('Unauthorized');
        }

        if (!attendance.checkIn) {
            throw new ValidationError('No check-in record found');
        }

        if (attendance.checkOut) {
            throw new ValidationError('Already checked out');
        }

        const checkOut = new Date();
        const breakMinutes = 60; // Default 1 hour break
        const diffMs = checkOut.getTime() - attendance.checkIn.getTime();
        const diffMinutes = diffMs / (1000 * 60);
        const workingMinutes = Math.max(0, diffMinutes - breakMinutes);
        
        // Standard working hours per day (8 hours = 480 minutes)
        const standardMinutes = 8 * 60;
        const overtimeMinutes = Math.max(0, workingMinutes - standardMinutes);

        const updated = await Attendance.findByIdAndUpdate(
            attendanceId,
            {
                checkOut,
                workingMinutes: Math.round(workingMinutes),
                overtimeMinutes: Math.round(overtimeMinutes),
            },
            { new: true }
        );

        return {
            checkOutTime: updated!.checkOut!.toISOString(),
            workingMinutes: updated!.workingMinutes,
            overtimeMinutes: updated!.overtimeMinutes,
        };
    }

    /**
     * Get attendance records
     */
    async getAttendanceRecords(
        userId: string,
        role: Role,
        filters: {
            employeeId?: string;
            month?: string;
            year?: string;
            page?: number;
            limit?: number;
        }
    ) {
        const page = filters.page || 1;
        const limit = filters.limit || 30;
        const skip = (page - 1) * limit;

        if (role === Role.EMPLOYEE) {
            return this.getEmployeeAttendance(userId, filters.month, filters.year, page, limit, skip);
        } else {
            return this.getAdminAttendance(filters.employeeId, filters.month, filters.year, page, limit, skip);
        }
    }

    private async getEmployeeAttendance(
        userId: string,
        month?: string,
        year?: string,
        page: number = 1,
        limit: number = 30,
        skip: number = 0
    ) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month.split('-')[1]) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const { start, end } = getMonthDateRange(targetYear, targetMonth);

        const records = await Attendance.find({
            userId: user._id,
            date: { $gte: start, $lte: end },
        })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Attendance.countDocuments({
            userId: user._id,
            date: { $gte: start, $lte: end },
        });

        const daysPresent = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
        const daysAbsent = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
        const leavesTaken = records.filter(r => r.status === AttendanceStatus.LEAVE).length;

        return {
            summary: {
                month: `${start.toLocaleString('default', { month: 'long' })} ${targetYear}`,
                totalWorkingDays: 22, // Simplified
                daysPresent,
                daysAbsent,
                leavesTaken,
                halfDays: 0,
            },
            records: records.map(r => ({
                date: formatDate(r.date),
                day: r.date.toLocaleDateString('en-US', { weekday: 'long' }),
                checkIn: r.checkIn ? r.checkIn.toISOString().substring(11, 16) : null,
                checkOut: r.checkOut ? r.checkOut.toISOString().substring(11, 16) : null,
                workingMinutes: r.workingMinutes,
                workingHours: r.workingMinutes ? (r.workingMinutes / 60).toFixed(2) : null,
                overtimeMinutes: r.overtimeMinutes,
                overtimeHours: r.overtimeMinutes ? (r.overtimeMinutes / 60).toFixed(2) : null,
                status: r.status,
            })),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    private async getAdminAttendance(
        employeeId?: string,
        month?: string,
        year?: string,
        page: number = 1,
        limit: number = 30,
        skip: number = 0
    ) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const where: any = {
            date: { $gte: today },
        };

        if (employeeId) {
            where.userId = new mongoose.Types.ObjectId(employeeId);
        }

        const records = await Attendance.find(where)
            .populate('userId')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Attendance.countDocuments(where);

        const present = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
        const absent = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
        const onLeave = records.filter(r => r.status === AttendanceStatus.LEAVE).length;

        return {
            summary: {
                date: formatDate(today),
                totalEmployees: await Employee.countDocuments({ status: 'ACTIVE' }),
                present,
                absent,
                onLeave,
            },
            records: records.map((r: any) => {
                const user = r.userId;
                return {
                    employee: {
                        id: user?._id?.toString(),
                        name: user?.name || '',
                        email: user?.email,
                        department: '', // Would need EmployeeProfile lookup
                    },
                    checkIn: r.checkIn ? r.checkIn.toISOString().substring(11, 16) : null,
                    checkOut: r.checkOut ? r.checkOut.toISOString().substring(11, 16) : null,
                    workingMinutes: r.workingMinutes,
                    workingHours: r.workingMinutes ? (r.workingMinutes / 60).toFixed(2) : null,
                    overtimeMinutes: r.overtimeMinutes,
                    overtimeHours: r.overtimeMinutes ? (r.overtimeMinutes / 60).toFixed(2) : null,
                    status: r.status,
                };
            }),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
