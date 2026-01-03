import { Request, Response, NextFunction } from 'express';
import { LeaveTypeService } from '../services/leavetype.service';
import { ApiResponse } from '../types';

const leaveTypeService = new LeaveTypeService();

export class LeaveTypeController {
    async createLeaveType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, maxPerYear, isPaid, carryForward } = req.body;

            const result = await leaveTypeService.createLeaveType({
                name,
                maxPerYear,
                isPaid,
                carryForward,
            });

            const response: ApiResponse = {
                success: true,
                message: 'Leave type created successfully',
                data: result,
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAllLeaveTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await leaveTypeService.getAllLeaveTypes();

            const response: ApiResponse = {
                success: true,
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getLeaveTypeById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { leaveTypeId } = req.params;

            const result = await leaveTypeService.getLeaveTypeById(leaveTypeId);

            const response: ApiResponse = {
                success: true,
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateLeaveType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { leaveTypeId } = req.params;
            const { name, maxPerYear, isPaid, carryForward } = req.body;

            const result = await leaveTypeService.updateLeaveType(leaveTypeId, {
                name,
                maxPerYear,
                isPaid,
                carryForward,
            });

            const response: ApiResponse = {
                success: true,
                message: 'Leave type updated successfully',
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteLeaveType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { leaveTypeId } = req.params;

            const result = await leaveTypeService.deleteLeaveType(leaveTypeId);

            const response: ApiResponse = {
                success: true,
                message: result.message,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

