import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models';
import { ApiResponse } from '../types';

export class NotificationController {
    async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { unreadOnly, type, page = 1, limit = 20 } = req.query;
            const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

            const where: any = { userId: new mongoose.Types.ObjectId(req.user!.userId) };

            if (unreadOnly === 'true') {
                where.read = false;
            }

            if (type) {
                where.type = type;
            }

            const notifications = await Notification.find(where)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit as string));

            const unreadCount = await Notification.countDocuments({
                userId: new mongoose.Types.ObjectId(req.user!.userId),
                read: false,
            });

            const response: ApiResponse = {
                success: true,
                data: {
                    notifications: notifications.map(n => ({
                        id: n._id.toString(),
                        type: n.type,
                        title: n.title,
                        message: n.message,
                        read: n.read,
                        timestamp: n.createdAt.toISOString(),
                        metadata: n.metadata,
                    })),
                    unreadCount,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { notificationId } = req.params;

            await Notification.findByIdAndUpdate(notificationId, { read: true });

            const response: ApiResponse = {
                success: true,
                message: 'Notification marked as read',
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
