import mongoose from 'mongoose';
import { AuditLog } from '../models';

export class AuditService {
    /**
     * Log an action
     */
    async log(action: string, entity: string, entityId: string, performedBy: string, metadata?: any) {
        const log = await AuditLog.create({
            action,
            entity,
            entityId: new mongoose.Types.ObjectId(entityId),
            performedBy: new mongoose.Types.ObjectId(performedBy),
            timestamp: new Date(),
            metadata,
        });

        return log;
    }

    /**
     * Get audit logs with filters
     */
    async getAuditLogs(filters: {
        action?: string;
        entity?: string;
        entityId?: string;
        performedBy?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }) {
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const skip = (page - 1) * limit;

        const query: any = {};

        if (filters.action) query.action = filters.action;
        if (filters.entity) query.entity = filters.entity;
        if (filters.entityId) query.entityId = new mongoose.Types.ObjectId(filters.entityId);
        if (filters.performedBy) query.performedBy = new mongoose.Types.ObjectId(filters.performedBy);
        if (filters.startDate || filters.endDate) {
            query.timestamp = {};
            if (filters.startDate) query.timestamp.$gte = filters.startDate;
            if (filters.endDate) query.timestamp.$lte = filters.endDate;
        }

        const logs = await AuditLog.find(query)
            .populate('performedBy', 'name email role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AuditLog.countDocuments(query);

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get audit logs for a specific entity
     */
    async getEntityAuditLogs(entity: string, entityId: string, page: number = 1, limit: number = 50) {
        return await this.getAuditLogs({
            entity,
            entityId,
            page,
            limit,
        });
    }
}

