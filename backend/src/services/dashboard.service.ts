import mongoose from 'mongoose';
import { User, Employee, Attendance, LeaveRequest, Notification } from '../models';
import { Role, AttendanceStatus, LeaveRequestStatus } from '../types';
import { formatDate } from '../utils/helpers';

export class DashboardService {
    /**
     * Get dashboard data based on user role
     */
    async getDashboardData(userId: string, role: Role) {
        if (role === Role.EMPLOYEE) {
            return this.getEmployeeDashboard(userId);
        } else {
            return this.getAdminDashboard();
        }
    }

    /**
     * Employee dashboard
     */
    private async getEmployeeDashboard(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) {
            throw new Error('Employee not found');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get today's attendance
        const todayAttendance = await Attendance.findOne({
            userId: user._id,
            date: { $gte: today },
        });

        // Get leave balance (simplified - would need proper calculation)
        const leaveRequests = await LeaveRequest.find({
            userId: user._id,
            status: LeaveRequestStatus.APPROVED,
        }).populate('leaveTypeId');

        // Calculate leave balance by leave type
        const leaveTypeMap = new Map<string, number>();
        leaveRequests.forEach(l => {
            const leaveType = (l.leaveTypeId as any);
            const typeName = leaveType?.name || 'UNKNOWN';
            leaveTypeMap.set(typeName, (leaveTypeMap.get(typeName) || 0) + l.totalDays);
        });

        // Get upcoming leaves
        const upcomingLeaves = await LeaveRequest.find({
            userId: user._id,
            status: LeaveRequestStatus.APPROVED,
            fromDate: { $gte: new Date() },
        })
            .populate('leaveTypeId')
            .sort({ fromDate: 1 })
            .limit(5);

        // Get recent activity
        const recentLeaves = await LeaveRequest.find({ userId: user._id })
            .populate('leaveTypeId')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get notifications
        const notifications = await Notification.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        return {
            quickStats: {
                attendanceToday: todayAttendance?.status || 'absent',
                checkInTime: todayAttendance?.checkIn ? todayAttendance.checkIn.toISOString().substring(11, 16) : null,
                checkOutTime: todayAttendance?.checkOut ? todayAttendance.checkOut.toISOString().substring(11, 16) : null,
                leaveBalance: {
                    paid: Math.max(0, 15 - (leaveTypeMap.get('Paid Leave') || leaveTypeMap.get('PAID') || 0)),
                    sick: Math.max(0, 7 - (leaveTypeMap.get('Sick Leave') || leaveTypeMap.get('SICK') || 0)),
                    unpaid: 0,
                },
                upcomingLeaves: upcomingLeaves.map((l: any) => {
                    const leaveType = l.leaveTypeId;
                    return {
                        type: leaveType?.name || 'Unknown',
                        startDate: formatDate(l.fromDate),
                        endDate: formatDate(l.toDate),
                    };
                }),
            },
            recentActivity: recentLeaves.map((l: any) => {
                const leaveType = l.leaveTypeId;
                return {
                    id: l._id.toString(),
                    type: 'leave_applied',
                    message: `Applied for ${leaveType?.name?.toLowerCase() || 'leave'} leave on ${formatDate(l.fromDate)}`,
                    timestamp: l.createdAt.toISOString(),
                };
            }),
            notifications: notifications.map(n => ({
                id: n._id.toString(),
                type: n.type,
                message: n.message,
                read: n.read,
                timestamp: n.createdAt.toISOString(),
            })),
        };
    }

    /**
     * Admin dashboard
     */
    private async getAdminDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get total employees
        const totalEmployees = await Employee.countDocuments({ status: 'ACTIVE' });

        // Get today's attendance
        const todayAttendances = await Attendance.find({
            date: { $gte: today },
        });

        const presentToday = todayAttendances.filter(a => a.status === AttendanceStatus.PRESENT).length;

        // Get employees on leave today
        const onLeaveToday = await LeaveRequest.countDocuments({
            status: LeaveRequestStatus.APPROVED,
            fromDate: { $lte: today },
            toDate: { $gte: today },
        });

        // Get pending approvals
        const pendingLeaves = await LeaveRequest.countDocuments({ status: LeaveRequestStatus.PENDING });

        // Get employee cards
        const employees = await Employee.find({ status: 'ACTIVE' })
            .populate('userId')
            .limit(50);

        const employeeCards = await Promise.all(
            employees.map(async (emp: any) => {
                const attendance = await Attendance.findOne({
                    userId: emp.userId._id,
                    date: { $gte: today },
                });

                const user = emp.userId;
                return {
                    id: user?._id?.toString() || emp.userId?.toString(),
                    name: user?.name || '',
                    email: user?.email,
                    role: emp.jobPosition,
                    department: emp.department,
                    status: attendance?.status || 'absent',
                    attendance: {
                        checkIn: attendance?.checkIn ? attendance.checkIn.toISOString().substring(11, 16) : null,
                        checkOut: attendance?.checkOut ? attendance.checkOut.toISOString().substring(11, 16) : null,
                    },
                };
            })
        );

        return {
            summary: {
                totalEmployees,
                presentToday,
                onLeave: onLeaveToday,
                pendingApprovals: pendingLeaves,
            },
            employeeCards,
            pendingActions: [
                {
                    type: 'leave_approval',
                    count: pendingLeaves,
                    items: [],
                },
                {
                    type: 'attendance_regularization',
                    count: 0,
                    items: [],
                },
            ],
        };
    }
}
