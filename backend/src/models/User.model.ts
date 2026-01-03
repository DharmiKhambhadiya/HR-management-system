import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../types';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.EMPLOYEE,
            required: true,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        lastLoginAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model<IUser>('User', UserSchema);
