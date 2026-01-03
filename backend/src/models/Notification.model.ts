import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../types';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    metadata?: any;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

