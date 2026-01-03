import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryStructure extends Document {
    userId: mongoose.Types.ObjectId;
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
    overtimeRatePerHour: number;
    effectiveFrom: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SalaryStructureSchema = new Schema<ISalaryStructure>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        basic: {
            type: Number,
            required: true,
        },
        hra: {
            type: Number,
            required: true,
            default: 0,
        },
        allowances: {
            type: Number,
            required: true,
            default: 0,
        },
        deductions: {
            type: Number,
            required: true,
            default: 0,
        },
        overtimeRatePerHour: {
            type: Number,
            required: true,
            default: 0,
        },
        effectiveFrom: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const SalaryStructure = mongoose.model<ISalaryStructure>('SalaryStructure', SalaryStructureSchema);

