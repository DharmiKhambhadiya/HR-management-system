import mongoose from 'mongoose';
import { User, Employee, LeaveRequest, Notification, LeaveType } from '../models';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors';
import { LeaveRequestStatus, Role, NotificationType } from '../types';
import { calculateDaysBetween, formatDate } from '../utils/helpers';
import { sendLeaveStatusEmail } from '../utils/email';

export class LeaveService {
    /**
     * Apply for leave
     */
    async applyLeave(
        userId: string,
        data: {
            leaveTypeId: string;
            fromDate: string;
            toDate: string;
            reason: string;
        }
    ) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Verify leave type exists
        const leaveType = await LeaveType.findById(data.leaveTypeId);
        if (!leaveType) {
            throw new NotFoundError('Leave type not found');
        }

        const fromDate = new Date(data.fromDate);
        const toDate = new Date(data.toDate);
        const totalDays = calculateDaysBetween(fromDate, toDate);

        const leaveRequest = await LeaveRequest.create({
            userId: user._id,
            leaveTypeId: new mongoose.Types.ObjectId(data.leaveTypeId),
            fromDate,
            toDate,
            totalDays,
            reason: data.reason,
            status: LeaveRequestStatus.PENDING,
            appliedAt: new Date(),
        });

        // Create notification for HR
        const hrUsers = await User.find({ role: Role.HR });

        await Promise.all(
            hrUsers.map(hrUser =>
                Notification.create({
                    userId: hrUser._id,
                    type: NotificationType.LEAVE_APPLIED,
                    title: 'New Leave Request',
                    message: `${user.name} applied for ${leaveType.name.toLowerCase()} leave`,
                    metadata: { leaveId: leaveRequest._id.toString() },
                })
            )
        );

        return {
            leaveId: leaveRequest._id.toString(),
            status: leaveRequest.status,
        };
    }

    /**
     * Get leave requests
     */
    async getLeaveRequests(
        userId: string,
        role: Role,
        filters: {
            status?: string;
            employeeId?: string;
            startDate?: string;
            endDate?: string;
            page?: number;
            limit?: number;
        }
    ) {
        const page = filters.page || 1;
        const limit = filters.limit || 30;
        const skip = (page - 1) * limit;

        if (role === Role.EMPLOYEE) {
            return this.getEmployeeLeaves(userId, filters.status, page, limit, skip);
        } else {
            return this.getAdminLeaves(filters, page, limit, skip);
        }
    }

    private async getEmployeeLeaves(
        userId: string,
        status?: string,
        page: number = 1,
        limit: number = 30,
        skip: number = 0
    ) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const where: any = { userId: user._id };
        if (status) {
            where.status = status.toUpperCase();
        }

        const requests = await LeaveRequest.find(where)
            .populate('leaveTypeId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate leave balance (simplified - should use LeaveBalanceService)
        const approvedLeaves = await LeaveRequest.find({
            userId: user._id,
            status: LeaveRequestStatus.APPROVED,
        }).populate('leaveTypeId');

        // Group by leave type name
        const leaveTypeMap = new Map<string, number>();
        approvedLeaves.forEach(l => {
            const leaveType = (l.leaveTypeId as any);
            const typeName = leaveType?.name || 'UNKNOWN';
            leaveTypeMap.set(typeName, (leaveTypeMap.get(typeName) || 0) + l.totalDays);
        });

        return {
            balance: {
                paid: Math.max(0, 15 - (leaveTypeMap.get('Paid Leave') || leaveTypeMap.get('PAID') || 0)),
                sick: Math.max(0, 7 - (leaveTypeMap.get('Sick Leave') || leaveTypeMap.get('SICK') || 0)),
                unpaid: 0,
            },
            requests: requests.map((r: any) => {
                const leaveType = r.leaveTypeId;
                return {
                    id: r._id.toString(),
                    leaveTypeId: r.leaveTypeId._id?.toString() || r.leaveTypeId.toString(),
                    leaveTypeName: leaveType?.name || 'Unknown',
                    fromDate: formatDate(r.fromDate),
                    toDate: formatDate(r.toDate),
                    totalDays: r.totalDays,
                    reason: r.reason,
                    status: r.status,
                    appliedOn: r.appliedAt.toISOString(),
                };
            }),
        };
    }

    private async getAdminLeaves(
        filters: any,
        page: number,
        limit: number,
        skip: number
    ) {
        const where: any = {};

        if (filters.status) {
            where.status = filters.status.toUpperCase();
        }

        if (filters.employeeId) {
            where.userId = new mongoose.Types.ObjectId(filters.employeeId);
        }

        const requests = await LeaveRequest.find(where)
            .populate('userId')
            .populate('leaveTypeId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await LeaveRequest.countDocuments(where);

        const pending = await LeaveRequest.countDocuments({ status: LeaveRequestStatus.PENDING });
        const approved = await LeaveRequest.countDocuments({ status: LeaveRequestStatus.APPROVED });
        const rejected = await LeaveRequest.countDocuments({ status: LeaveRequestStatus.REJECTED });

        return {
            summary: {
                pending,
                approved,
                rejected,
            },
            requests: requests.map((r: any) => {
                const user = r.userId;
                const leaveType = r.leaveTypeId;
                return {
                    id: r._id.toString(),
                    employee: {
                        id: user?._id?.toString(),
                        name: user?.name || '',
                        email: user?.email,
                    },
                    leaveTypeId: leaveType?._id?.toString(),
                    leaveTypeName: leaveType?.name || 'Unknown',
                    fromDate: formatDate(r.fromDate),
                    toDate: formatDate(r.toDate),
                    totalDays: r.totalDays,
                    reason: r.reason,
                    status: r.status,
                    appliedOn: r.appliedAt.toISOString(),
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

    /**
     * Approve or reject leave
     */
    async updateLeaveStatus(
        leaveId: string,
        action: 'approve' | 'reject',
        adminId: string,
        comments?: string
    ) {
        const leaveRequest = await LeaveRequest.findById(leaveId)
            .populate('userId')
            .populate('leaveTypeId');

        if (!leaveRequest) {
            throw new NotFoundError('Leave request not found');
        }

        const status = action === 'approve' ? LeaveRequestStatus.APPROVED : LeaveRequestStatus.REJECTED;

        const updated = await LeaveRequest.findByIdAndUpdate(
            leaveId,
            {
                status,
                approvedBy: new mongoose.Types.ObjectId(adminId),
            },
            { new: true }
        );

        const user = (leaveRequest as any).userId;
        const leaveType = (leaveRequest as any).leaveTypeId;

        // Create notification for employee
        if (user?._id) {
            await Notification.create({
                userId: user._id,
                type: action === 'approve' ? NotificationType.LEAVE_APPROVED : NotificationType.LEAVE_REJECTED,
                title: `Leave Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
                message: `Your ${leaveType?.name || 'leave'} request has been ${action}d`,
                metadata: { leaveId: leaveRequest._id.toString() },
            });

            // Send email
            const firstName = user.name.split(' ')[0] || user.name;
            await sendLeaveStatusEmail(
                user.email || '',
                firstName,
                action === 'approve' ? 'approved' : 'rejected',
                leaveType?.name || 'leave',
                formatDate(leaveRequest.fromDate),
                formatDate(leaveRequest.toDate),
                comments
            );
        }

        return {
            leaveId: updated!._id.toString(),
            status: updated!.status,
            updatedBy: adminId,
            updatedAt: updated!.updatedAt.toISOString(),
        };
    }
}
