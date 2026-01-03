import mongoose from 'mongoose';
import { Employee, User, Attendance, LeaveRequest } from '../models';
import { EmployeeStatus } from '../types';

export class AdminService {
    /**
     * Get all employees
     */
    async getAllEmployees(filters: {
        department?: string;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters.department) {
            where.department = filters.department;
        }

        if (filters.status) {
            where.status = filters.status.toUpperCase();
        }

        let employees: any[] = [];

        if (filters.search) {
            // Search across user fields and employee fields
            const users = await User.find({
                $or: [
                    { firstName: { $regex: filters.search, $options: 'i' } },
                    { lastName: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } },
                ],
            });

            const userIds = users.map(u => u._id);
            const employeesByUser = await Employee.find({
                userId: { $in: userIds },
                ...where,
            }).populate('userId');

            const employeesByCode = await Employee.find({
                employeeCode: { $regex: filters.search, $options: 'i' },
                ...where,
            }).populate('userId');

            const allEmployeeIds = new Set([
                ...employeesByUser.map((e: any) => e._id.toString()),
                ...employeesByCode.map((e: any) => e._id.toString()),
            ]);

            employees = await Employee.find({
                _id: { $in: Array.from(allEmployeeIds).map(id => new mongoose.Types.ObjectId(id)) },
                ...where,
            })
                .populate('userId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
        } else {
            employees = await Employee.find(where)
                .populate('userId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
        }

        const total = await Employee.countDocuments(where);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const employeeData = await Promise.all(
            employees.map(async (emp: any) => {
                const attendance = await Attendance.findOne({
                    employeeId: emp._id,
                    date: { $gte: today },
                });

                const user = emp.userId;
                const fullName = (user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`).trim();
                return {
                    id: user?._id?.toString() || emp.userId?.toString(),
                    employeeCode: emp.employeeCode,
                    name: fullName,
                    email: user?.email,
                    profilePic: user?.profilePicUrl,
                    department: emp.department,
                    jobPosition: emp.jobPosition,
                    location: emp.location,
                    status: emp.status,
                    attendanceToday: {
                        status: attendance?.status || 'absent',
                        checkIn: attendance?.checkIn ? attendance.checkIn.toISOString().substring(11, 16) : null,
                        checkOut: attendance?.checkOut ? attendance.checkOut.toISOString().substring(11, 16) : null,
                    },
                };
            })
        );

        // Get summary
        const active = await Employee.countDocuments({ status: EmployeeStatus.ACTIVE });
        const onLeave = await LeaveRequest.countDocuments({
            status: 'APPROVED',
            startDate: { $lte: today },
            endDate: { $gte: today },
        });

        const departments = await Employee.aggregate([
            { $match: { status: EmployeeStatus.ACTIVE } },
            { $group: { _id: '$department', count: { $sum: 1 } } },
        ]);

        return {
            employees: employeeData,
            summary: {
                total,
                active,
                onLeave,
                departments: departments.map(d => ({
                    name: d._id,
                    count: d.count,
                })),
            },
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Update employee status
     */
    async updateEmployeeStatus(employeeId: string, status: EmployeeStatus, _reason?: string) {
        const employee = await Employee.findOne({ userId: employeeId });

        if (!employee) {
            throw new Error('Employee not found');
        }

        await Employee.findByIdAndUpdate(employee._id, { status });

        return {
            message: `Employee status updated to ${status.toLowerCase()}`,
        };
    }
}
