import { z } from 'zod';

export const courseIdSchema = z.object({
    courseId: z.string().regex(/^\d+$/, 'Invalid course ID'),
});