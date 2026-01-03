import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

