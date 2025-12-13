import { z } from 'zod';

export const registerSchema = z.object({
    name: z
        .string('Name must be a string')
        .min(1, 'Name must be at least 1 character long')
        .max(15, 'Name cannot have more than 15 characters'),
    email: z
        .email('Invalid email'),
    password: z
        .string('Password must be a string')
        .min(5, 'Password must be at least 5 characters long')
        .max(32, 'Password cannot have more than 32 characters'),
    role: z
        .enum(['user', 'teacher', 'admin'], `role must be 'user', 'teacher' or 'admin'`)
        .default('user'),
});

export const loginSchema = z.object({
    name: z
        .string('Name must be a string')
        .min(1, 'Name must be at least 1 character long')
        .max(15, 'Name cannot have more than 15 characters')
        .optional(),
    email: z
        .email('Invalid email')
        .optional(),
    password: z
        .string('Password must be a string')
        .min(5, 'Password must be at least 5 characters long')
        .max(32, 'Password cannot have more than 32 characters')
});

export const idSchema = z.object({
    userId: z.coerce.number().int().positive()
});