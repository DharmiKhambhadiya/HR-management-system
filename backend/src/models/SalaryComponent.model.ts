import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryComponent extends Document {
    employeeId: mongoose.Types.ObjectId;
    monthYear: string;
    monthlyWage: number;
    basicSalary: number;
    hra: number;
    standardAllowance: number;
    performanceBonus?: number;
    lta?: number;
    fixedAllowance?: number;
    otherEarnings?: number;
    pfEmployee: number;
    pfEmployer: number;
    professionalTax: number;
    otherDeductions?: number;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    totalWorkingDays?: number;
    presentDays?: number;
    payableDays?: number;
    proRatedAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const SalaryComponentSchema = new Schema<ISalaryComponent>(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
            index: true,
        },
        monthYear: {
            type: String,
            required: true,
            index: true,
        },
        monthlyWage: {
            type: Number,
            required: true,
        },
        basicSalary: {
            type: Number,
            required: true,
        },
        hra: {
            type: Number,
            required: true,
        },
        standardAllowance: {
            type: Number,
            required: true,
        },
        performanceBonus: {
            type: Number,
        },
        lta: {
            type: Number,
        },
        fixedAllowance: {
            type: Number,
        },
        otherEarnings: {
            type: Number,
        },
        pfEmployee: {
            type: Number,
            required: true,
        },
        pfEmployer: {
            type: Number,
            required: true,
        },
        professionalTax: {
            type: Number,
            required: true,
        },
        otherDeductions: {
            type: Number,
        },
        grossSalary: {
            type: Number,
            required: true,
        },
        totalDeductions: {
            type: Number,
            required: true,
        },
        netSalary: {
            type: Number,
            required: true,
        },
        totalWorkingDays: {
            type: Number,
        },
        presentDays: {
            type: Number,
        },
        payableDays: {
            type: Number,
        },
        proRatedAmount: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique salary component per employee per month
SalaryComponentSchema.index({ employeeId: 1, monthYear: 1 }, { unique: true });

export const SalaryComponent = mongoose.model<ISalaryComponent>('SalaryComponent', SalaryComponentSchema);

