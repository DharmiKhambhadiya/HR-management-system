import { Request, Response, NextFunction } from 'express';
import { HolidayService } from '../services/holiday.service';
import { ApiResponse } from '../types';

const holidayService = new HolidayService();

export class HolidayController {
    async createOrUpdateHolidayCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { year, holidays } = req.body;
            const createdBy = req.user!.userId;

            const result = await holidayService.createOrUpdateHolidayCalendar(year, holidays, createdBy);

            const response: ApiResponse = {
                success: true,
                message: 'Holiday calendar created/updated successfully',
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getHolidayCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { year } = req.params;
            const yearNum = parseInt(year);

            const result = await holidayService.getHolidayCalendar(yearNum);

            const response: ApiResponse = {
                success: true,
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAllHolidayCalendars(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await holidayService.getAllHolidayCalendars();

            const response: ApiResponse = {
                success: true,
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteHolidayCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { year } = req.params;
            const yearNum = parseInt(year);

            const result = await holidayService.deleteHolidayCalendar(yearNum);

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

