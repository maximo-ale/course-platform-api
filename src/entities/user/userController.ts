import { AppError, BadRequestError, NotFoundError } from "../../utils/errors.js";

import type { Request, Response } from 'express';
import userService from "./userService.js";

class UserController{
    // Enroll in a course
    async enroll(req: Request, res: Response){
        const enrolledCourse = await userService.enroll(parseInt(req.userId!), parseInt(req.params.courseId))

        res.status(200).json({
            message: 'Successfully enrolled',
            course: enrolledCourse,
        });
    }

    // Get all courses the user is enrolled in
    async showEnrolled(req: Request, res: Response){
        const courses = await userService.myCourses(parseInt(req.userId!));
        res.status(200).json({
            message: 'Courses found',
            courses,
        });
    }

    // Get created courses (only teachers or admins)
    async showCreated(req: Request, res: Response){
        const createdCourses = await userService.createdCourses(parseInt(req.userId!));

        res.status(200).json({
            message: 'Created courses found',
            createdCourses,
        });  
    }

    // Leave a course
    async leave(req: Request, res: Response){
        const courseLeft = await userService.leave(parseInt(req.userId!), parseInt(req.params.courseId));

        res.status(200).json({
            message: 'Course left',
            courseToLeave: courseLeft,
        });
    }
}

export default new UserController();