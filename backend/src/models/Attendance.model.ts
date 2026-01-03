import mongoose, { Schema, Document } from 'mongoose';
import { AttendanceStatus } from '../types';

export interface IAttendance extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    workingMinutes?: number;
    overtimeMinutes?: number;
    status: AttendanceStatus;
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        checkIn: {
            type: Date,
        },
        checkOut: {
            type: Date,
        },
        workingMinutes: {
            type: Number,
        },
        overtimeMinutes: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: Object.values(AttendanceStatus),
            default: AttendanceStatus.ABSENT,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique attendance per user per day
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
