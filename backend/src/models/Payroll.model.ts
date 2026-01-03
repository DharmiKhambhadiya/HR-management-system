import mongoose, { Schema, Document } from 'mongoose';
import { PayrollStatus } from '../types';

export interface IPayroll extends Document {
    userId: mongoose.Types.ObjectId;
    month: number;
    year: number;
    payableDays: number;
    paidLeaveDays: number;
    unpaidLeaveDays: number;
    overtimeAmount: number;
    grossSalary: number;
    deductions: number;
    netSalary: number;
    status: PayrollStatus;
    generatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PayrollSchema = new Schema<IPayroll>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
            index: true,
        },
        year: {
            type: Number,
            required: true,
            index: true,
        },
        payableDays: {
            type: Number,
            required: true,
            default: 0,
        },
        paidLeaveDays: {
            type: Number,
            required: true,
            default: 0,
        },
        unpaidLeaveDays: {
            type: Number,
            required: true,
            default: 0,
        },
        overtimeAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        grossSalary: {
            type: Number,
            required: true,
        },
        deductions: {
            type: Number,
            required: true,
            default: 0,
        },
        netSalary: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(PayrollStatus),
            default: PayrollStatus.GENERATED,
            required: true,
            index: true,
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique payroll per user per month/year
PayrollSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema);

