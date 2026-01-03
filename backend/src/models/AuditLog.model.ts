import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    action: string;
    entity: string;
    entityId: mongoose.Types.ObjectId;
    performedBy: mongoose.Types.ObjectId;
    timestamp: Date;
    metadata?: any;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        action: {
            type: String,
            required: true,
            index: true,
        },
        entity: {
            type: String,
            required: true,
            index: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
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

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

