import mongoose, { Schema, Document } from 'mongoose';

export interface IPayrollRun extends Document {
    month: number;
    year: number;
    processedBy: mongoose.Types.ObjectId;
    totalEmployees: number;
    status: string;
    executedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PayrollRunSchema = new Schema<IPayrollRun>(
    {
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
        },
        processedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        totalEmployees: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            required: true,
            default: 'PENDING',
        },
        executedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique payroll run per month/year
PayrollRunSchema.index({ month: 1, year: 1 }, { unique: true });

export const PayrollRun = mongoose.model<IPayrollRun>('PayrollRun', PayrollRunSchema);

