import type { Request, Response } from 'express';
import courseService from './courseService.ts';

interface Query{
    title?: string,
    teacher?: string,
    category?: string,
    sort?: string,
    page?: string,
    limit?: string,
}

class CourseController{
    // Get all published courses (visible to any authenticated user)
    async getCoursesForUsers(req: Request<{}, {}, {}, Query>, res: Response){
        const pageNumber: number = parseInt(req.query.page!);
        const pageLimit: number = parseInt(req.query.limit!);
        const { courses, page, limit } = await courseService.getCoursesForUsers(req.query, {page: pageNumber, limit: pageLimit});
        
        res.status(200).json({
            message: 'Courses found',
            page,
            limit,
            count: courses.length,
            courses,
        });
    }

    // Get all courses, including unpublished ones (only for admins)
    async getCourses(req: Request, res: Response){
        const courses = await courseService.getAllCourses();

        res.status(200).json({
            message: 'Courses found',
            courses,
        });
    }

    // Return a specific course by ID and include teacher's info.
    async getCourse(req: Request, res: Response){
        const course = await courseService.getCourse(parseInt(req.params.courseId));

        res.status(200).json({
            message: 'Course found successfully',
            course,
        });
    }

    async createCourse(req: Request, res: Response){
        const newCourse = await courseService.createCourse(req.body, parseInt(req.userId!));

        res.status(201).json({
            message: 'Course created successfully',
            newCourse,
        });
    }

    // Teachers may update only their courses, but admins can update any course.
    async updateCourse(req: Request, res: Response){
        const course = await courseService.updateCourse(parseInt(req.params.courseId), req.body);
        
        res.status(200).json({
            message: 'Course successfully updated',
            course,
        });        
    }

    // Remove a student from a course (only available to admins and teachers) 
    async removeStudent(req: Request, res: Response){
        await courseService.removeStudent(parseInt(req.params.userId), parseInt(req.params.courseId)); 

        res.status(200).json({message: 'User removed successfully'});
    }

    // Teachers may delete their course. Admins may delete any.
    async deleteCourse(req: Request, res: Response){
        const course = await courseService.deleteCourse(parseInt(req.params.courseId));

        res.status(200).json({
            message: 'Successfully deleted course',
            course,
        });
    }

    // Delete all courses (only available to admins)
    async deleteCourses(req: Request, res: Response){
        //await courseService
        //res.status(200).json({message: 'Courses deleted successfully'});        
    }
}

export default new CourseController();