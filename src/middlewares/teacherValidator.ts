import type { Request, Response, NextFunction } from 'express';
import { AppError, ForbiddenError, NotAuthorizedError, NotFoundError } from '../utils/errors.js';
import courseDB from '../entities/courses/courseRepository.js';

// Verify if teacher is modifying its own course
const teacherValidator = (courseIdParam = 'id') => {
    return async (req: Request, res: Response, next: NextFunction) => {
            if (req.role !== 'teacher' && req.role !== 'admin'){
                throw new NotAuthorizedError('Not authorized');
            }

            const course = await courseDB.getCourse(parseInt(req.params[courseIdParam]));
            if (!course){
                throw new NotFoundError('Course not found');
            }

            if (req.role === 'teacher' && course.teacher.toString() !== req.userId){
                throw new ForbiddenError(`Unauthorized to modify other teacher's course`);
            }

            next();
        }
}

export default teacherValidator;