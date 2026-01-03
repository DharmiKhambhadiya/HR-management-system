import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveBalanceItem {
    leaveTypeId: mongoose.Types.ObjectId;
    total: number;
    used: number;
    remaining: number;
}

export interface ILeaveBalance extends Document {
    userId: mongoose.Types.ObjectId;
    year: number;
    balances: ILeaveBalanceItem[];
    createdAt: Date;
    updatedAt: Date;
}

const LeaveBalanceItemSchema = new Schema<ILeaveBalanceItem>(
    {
        leaveTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'LeaveType',
            required: true,
        },
        total: {
            type: Number,
            required: true,
            default: 0,
        },
        used: {
            type: Number,
            required: true,
            default: 0,
        },
        remaining: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { _id: false }
);

const LeaveBalanceSchema = new Schema<ILeaveBalance>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        year: {
            type: Number,
            required: true,
            index: true,
        },
        balances: {
            type: [LeaveBalanceItemSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique leave balance per user per year
LeaveBalanceSchema.index({ userId: 1, year: 1 }, { unique: true });

export const LeaveBalance = mongoose.model<ILeaveBalance>('LeaveBalance', LeaveBalanceSchema);

