import { z } from 'zod';

export const getCoursesSchema = z.object({
    title: z.string().min(1, 'Invalid title field').optional(),
    teacher: z.string().regex(/^\d+$/, 'Invalid provided ID').optional(),
    category: z.union([z.string(), z.array(z.string().min(1, 'Invalid category field'))]).optional(),
    minPrice: z.string('Minimum price must be a string').optional(),
    maxPrice: z.string('Maximum price must be a string').optional(),
    sort: z.union([z.string(), z.array(z.string())]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
}).superRefine((data, ctx) => {
    const min: number = parseInt(data.minPrice!);
    const max: number = parseInt(data.maxPrice!);

    if (min < 0){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Minimum price cannot be less than 0',
            path: ["minPrice"],
        });
    }

    if (max < 0){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Maximum price cannot be less than 0',
            path: ["maxPrice"],
        });
    }

    if ((min && max) && min > max){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Minimum price cannot be greater than the maximum price',
            path: ["minPrice", "maxPrice"],
        });
    }
});

export const createCourseSchema = z.object({
    title: z.string('Title must be a string'),
    description: z.string('Description must be a string').optional(),
    category: z.union([z.string('At least one category must be provided'), z.array(z.string())]),
    price: z.number('Price must be a number').min(0, 'Course price must be equals or greater than 0'),
    published: z.boolean('Published must be a boolean').optional(),
});

export const updateUserSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.union([z.string(), z.array(z.string())], 'Category can only have strings').optional(),
    price: z.number().min(0, 'Course cannot have a negative value').optional(),
    published: z.boolean('Published must be a boolean').optional(),
}).superRefine((data, ctx) => {
    const { title, description, category, price, published } = data;

    // At least one field must be modified
    if (!(title || description || category || price || published)){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least one field must be modified',
        });
    }
});

export const getCourseByIDSchema = z.object({
    courseId: z.string().regex(/^\d+$/, 'Invalid course ID'),
});

export const removeUserSchema = z.object({
    courseId: z.string().regex(/^\d+$/, 'Invalid course ID'),
    userId: z.string().regex(/^\d+$/, 'Invalid user ID'),
});