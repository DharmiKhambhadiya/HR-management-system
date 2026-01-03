import mongoose, { Schema, Document } from 'mongoose';
import { EmploymentType } from '../types';

export interface IEmployeeProfile extends Document {
    userId: mongoose.Types.ObjectId;
    employeeCode: string;
    department: string;
    designation: string;
    employmentType: EmploymentType;
    joiningDate: Date;
    probationEndDate?: Date;
    reportingManager?: mongoose.Types.ObjectId;
    bankDetails: {
        accountNumber?: string;
        bankName?: string;
        ifscCode?: string;
        panNumber?: string;
        uanNumber?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const EmployeeProfileSchema = new Schema<IEmployeeProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        employeeCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        department: {
            type: String,
            required: true,
            index: true,
        },
        designation: {
            type: String,
            required: true,
        },
        employmentType: {
            type: String,
            enum: Object.values(EmploymentType),
            default: EmploymentType.FULL_TIME,
            required: true,
        },
        joiningDate: {
            type: Date,
            required: true,
        },
        probationEndDate: {
            type: Date,
        },
        reportingManager: {
            type: Schema.Types.ObjectId,
            ref: 'EmployeeProfile',
            index: true,
        },
        bankDetails: {
            accountNumber: String,
            bankName: String,
            ifscCode: String,
            panNumber: String,
            uanNumber: String,
        },
    },
    {
        timestamps: true,
    }
);

export const EmployeeProfile = mongoose.model<IEmployeeProfile>('EmployeeProfile', EmployeeProfileSchema);

