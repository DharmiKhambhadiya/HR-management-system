import mongoose, { Schema, Document } from 'mongoose';
import { HolidayType } from '../types';

export interface IHoliday {
    date: Date;
    name: string;
    type: HolidayType;
}

export interface IHolidayCalendar extends Document {
    year: number;
    holidays: IHoliday[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const HolidaySchema = new Schema<IHoliday>(
    {
        date: {
            type: Date,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(HolidayType),
            required: true,
        },
    },
    { _id: false }
);

const HolidayCalendarSchema = new Schema<IHolidayCalendar>(
    {
        year: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        holidays: {
            type: [HolidaySchema],
            default: [],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const HolidayCalendar = mongoose.model<IHolidayCalendar>('HolidayCalendar', HolidayCalendarSchema);

