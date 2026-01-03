import { LeaveType } from '../models';
import { NotFoundError, ConflictError } from '../utils/errors';

export class LeaveTypeService {
    /**
     * Create leave type
     */
    async createLeaveType(data: { name: string; maxPerYear: number; isPaid: boolean; carryForward: boolean }) {
        const existing = await LeaveType.findOne({ name: data.name });

        if (existing) {
            throw new ConflictError('Leave type with this name already exists');
        }

        const leaveType = await LeaveType.create(data);
        return leaveType;
    }

    /**
     * Get all leave types
     */
    async getAllLeaveTypes() {
        return await LeaveType.find().sort({ name: 1 });
    }

    /**
     * Get leave type by ID
     */
    async getLeaveTypeById(leaveTypeId: string) {
        const leaveType = await LeaveType.findById(leaveTypeId);

        if (!leaveType) {
            throw new NotFoundError('Leave type not found');
        }

        return leaveType;
    }

    /**
     * Update leave type
     */
    async updateLeaveType(leaveTypeId: string, data: Partial<{ name: string; maxPerYear: number; isPaid: boolean; carryForward: boolean }>) {
        const leaveType = await LeaveType.findByIdAndUpdate(
            leaveTypeId,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!leaveType) {
            throw new NotFoundError('Leave type not found');
        }

        return leaveType;
    }

    /**
     * Delete leave type
     */
    async deleteLeaveType(leaveTypeId: string) {
        const leaveType = await LeaveType.findByIdAndDelete(leaveTypeId);

        if (!leaveType) {
            throw new NotFoundError('Leave type not found');
        }

        return { message: 'Leave type deleted successfully' };
    }
}

