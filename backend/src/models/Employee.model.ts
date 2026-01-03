import mongoose, { Schema, Document } from 'mongoose';
import { EmployeeStatus } from '../types';

export interface IEmployee extends Document {
    userId: mongoose.Types.ObjectId;
    employeeCode: string;
    company: string;
    department: string;
    jobPosition?: string;
    managerId?: mongoose.Types.ObjectId;
    location: string;
    dateOfJoining: Date;
    dateOfBirth?: Date;
    gender?: string;
    maritalStatus?: string;
    nationality?: string;
    address?: string;
    phone?: string;
    status: EmployeeStatus;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    panNumber?: string;
    uanNumber?: string;
    workingDays: number;
    dailyHours: number;
    breakTime: string;
    monthlyWage: number;
}

const EmployeeSchema = new Schema<IEmployee>(
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
        company: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
            index: true,
        },
        jobPosition: {
            type: String,
        },
        managerId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            index: true,
        },
        location: {
            type: String,
            required: true,
        },
        dateOfJoining: {
            type: Date,
            required: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
        },
        maritalStatus: {
            type: String,
        },
        nationality: {
            type: String,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(EmployeeStatus),
            default: EmployeeStatus.ACTIVE,
            required: true,
        },
        accountNumber: {
            type: String,
        },
        bankName: {
            type: String,
        },
        ifscCode: {
            type: String,
        },
        panNumber: {
            type: String,
        },
        uanNumber: {
            type: String,
        },
        workingDays: {
            type: Number,
            default: 5,
        },
        dailyHours: {
            type: Number,
            default: 8,
        },
        breakTime: {
            type: String,
            default: '01:00',
        },
        monthlyWage: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

