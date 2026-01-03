import mongoose, { Schema, Document } from 'mongoose';
import { LeaveRequestStatus } from '../types';

export interface ILeaveRequest extends Document {
    userId: mongoose.Types.ObjectId;
    leaveTypeId: mongoose.Types.ObjectId;
    fromDate: Date;
    toDate: Date;
    totalDays: number;
    reason: string;
    status: LeaveRequestStatus;
    approvedBy?: mongoose.Types.ObjectId;
    appliedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        leaveTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'LeaveType',
            required: true,
            index: true,
        },
        fromDate: {
            type: Date,
            required: true,
            index: true,
        },
        toDate: {
            type: Date,
            required: true,
        },
        totalDays: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(LeaveRequestStatus),
            default: LeaveRequestStatus.PENDING,
            required: true,
            index: true,
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
