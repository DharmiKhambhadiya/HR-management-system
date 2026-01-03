import mongoose from 'mongoose';
import { LeaveBalance, LeaveType } from '../models';
import { NotFoundError } from '../utils/errors';

export class LeaveBalanceService {
    /**
     * Initialize leave balance for a user for a year
     */
    async initializeLeaveBalance(userId: string, year: number) {
        const leaveTypes = await LeaveType.find();
        
        const balances = leaveTypes.map(lt => ({
            leaveTypeId: lt._id,
            total: lt.maxPerYear,
            used: 0,
            remaining: lt.maxPerYear,
        }));

        const leaveBalance = await LeaveBalance.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), year },
            {
                userId: new mongoose.Types.ObjectId(userId),
                year,
                balances,
            },
            { upsert: true, new: true }
        ).populate('balances.leaveTypeId');

        return leaveBalance;
    }

    /**
     * Get leave balance for a user
     */
    async getLeaveBalance(userId: string, year?: number) {
        const targetYear = year || new Date().getFullYear();
        const leaveBalance = await LeaveBalance.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            year: targetYear,
        }).populate('balances.leaveTypeId');

        if (!leaveBalance) {
            // Initialize if not exists
            return await this.initializeLeaveBalance(userId, targetYear);
        }

        return leaveBalance;
    }

    /**
     * Update leave balance (used when leave is approved)
     */
    async updateLeaveBalance(userId: string, leaveTypeId: string, days: number, year?: number) {
        const targetYear = year || new Date().getFullYear();
        const leaveBalance = await LeaveBalance.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            year: targetYear,
        });

        if (!leaveBalance) {
            throw new NotFoundError('Leave balance not found. Please initialize first.');
        }

        const balanceIndex = leaveBalance.balances.findIndex(
            b => b.leaveTypeId.toString() === leaveTypeId
        );

        if (balanceIndex === -1) {
            throw new NotFoundError('Leave type not found in balance');
        }

        leaveBalance.balances[balanceIndex].used += days;
        leaveBalance.balances[balanceIndex].remaining = 
            leaveBalance.balances[balanceIndex].total - leaveBalance.balances[balanceIndex].used;

        await leaveBalance.save();

        return leaveBalance;
    }

    /**
     * Get available leave days for a leave type
     */
    async getAvailableLeaveDays(userId: string, leaveTypeId: string, year?: number): Promise<number> {
        const leaveBalance = await this.getLeaveBalance(userId, year);
        const balance = leaveBalance.balances.find(
            b => b.leaveTypeId.toString() === leaveTypeId
        );

        return balance ? balance.remaining : 0;
    }
}

