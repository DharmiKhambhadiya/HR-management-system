import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
    userId: mongoose.Types.ObjectId;
    otpHash: string;
    expiresAt: Date;
    isUsed: boolean;
    createdAt: Date;
}

const OTPSchema = new Schema<IOTP>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        otpHash: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const OTP = mongoose.model<IOTP>('OTP', OTPSchema);

