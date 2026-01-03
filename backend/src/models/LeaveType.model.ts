import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveType extends Document {
    name: string;
    maxPerYear: number;
    isPaid: boolean;
    carryForward: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LeaveTypeSchema = new Schema<ILeaveType>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        maxPerYear: {
            type: Number,
            required: true,
            default: 0,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        carryForward: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const LeaveType = mongoose.model<ILeaveType>('LeaveType', LeaveTypeSchema);

