import mongoose from 'mongoose';
import { HolidayCalendar } from '../models';
import { NotFoundError, ConflictError } from '../utils/errors';
import { HolidayType } from '../types';

export class HolidayService {
    /**
     * Create or update holiday calendar for a year
     */
    async createOrUpdateHolidayCalendar(year: number, holidays: Array<{ date: Date; name: string; type: HolidayType }>, createdBy: string) {
        const existing = await HolidayCalendar.findOne({ year });

        if (existing) {
            existing.holidays = holidays;
            existing.createdBy = new mongoose.Types.ObjectId(createdBy);
            await existing.save();
            return existing;
        }

        const calendar = await HolidayCalendar.create({
            year,
            holidays,
            createdBy: new mongoose.Types.ObjectId(createdBy),
        });

        return calendar;
    }

    /**
     * Get holiday calendar for a year
     */
    async getHolidayCalendar(year: number) {
        const calendar = await HolidayCalendar.findOne({ year });

        if (!calendar) {
            throw new NotFoundError(`Holiday calendar for year ${year} not found`);
        }

        return calendar;
    }

    /**
     * Get all holiday calendars
     */
    async getAllHolidayCalendars() {
        return await HolidayCalendar.find().sort({ year: -1 }).populate('createdBy', 'name email');
    }

    /**
     * Delete holiday calendar
     */
    async deleteHolidayCalendar(year: number) {
        const calendar = await HolidayCalendar.findOneAndDelete({ year });

        if (!calendar) {
            throw new NotFoundError(`Holiday calendar for year ${year} not found`);
        }

        return { message: 'Holiday calendar deleted successfully' };
    }

    /**
     * Check if a date is a holiday
     */
    async isHoliday(date: Date): Promise<boolean> {
        const year = date.getFullYear();
        const calendar = await HolidayCalendar.findOne({ year });

        if (!calendar) {
            return false;
        }

        const dateStr = date.toISOString().split('T')[0];
        return calendar.holidays.some(h => {
            const holidayDateStr = h.date.toISOString().split('T')[0];
            return holidayDateStr === dateStr;
        });
    }
}

