import {z} from 'zod';

export interface SmokeLog {
    id: number;
    date: Date;
    count: number;
    reason: string;
    notes?: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface CreateSmokeLogDTO {
    date: Date;
    count: number;
    reason: string;
    notes?: string;
}

export interface UpdateSmokeLogDTO {
    date?: Date;
    count?: number;
    reason?: string;
    notes?: string | null;
}

const dateTransformer = z.preprocess((arg) => {
    if (arg instanceof Date) {
        return arg;
    }

    if (typeof arg === 'string') {
        let date = new Date(arg);

        if (isNaN(date.getTime()) && arg.match(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/)) {
            const [datePart, timePart] = arg.split(' ');
            const [day, month, year] = datePart.split('.');
            const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}:00`;
            date = new Date(isoString);
        }

        if (isNaN(date.getTime()) && !isNaN(Number(arg))) {
            date = new Date(Number(arg));
        }

        return date;
    }

    return arg;
}, z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format. Use ISO string, DD.MM.YYYY HH:mm, or timestamp",
}));

export const createSmokeLogSchema = z.object({
    date: dateTransformer,
    count: z.number().min(1).max(20),
    reason: z.string().min(1, "Reason is required"),
    notes: z.string().optional(),
});

export const updateSmokeLogSchema = z.object({
    date: dateTransformer.optional(),
    count: z.number().min(1).max(20).optional(),
    reason: z.string().min(1, "Reason is required").optional(),
    notes: z.string().optional(),
});

export type CreateSmokeLogInput = z.infer<typeof createSmokeLogSchema>;
export type UpdateSmokeLogInput = z.infer<typeof updateSmokeLogSchema>;