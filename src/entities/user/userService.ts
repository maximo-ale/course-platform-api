import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import courseDB from "../courses/courseRepository.js";
import userDB from "./userRepository.js";

interface FullCourseInfo{
    id: number,
    title: string,
    description: string,
    price: number,
    category: string[],
}

interface PartialCourseInfo{
    id: number,
    title: string,
}

class UserService{
    async enroll(userId: number, courseId: number): Promise<FullCourseInfo>{
        const courseToEnroll = await courseDB.getCourse(courseId);
        const userCourses = await userDB.getUserCourses(userId);

        if (!courseToEnroll) {
            throw new NotFoundError('Course not found');
        } 

        // Look if user is already enrolled in the course
        if (userCourses.some(c => c.id === courseId)){
            throw new BadRequestError('Already enrolled in the course');
        }

        const course = await userDB.enroll(userId, courseId);

        return course;
    }

    async myCourses(userId: number): Promise<PartialCourseInfo[]>{
        const userCourses = await userDB.getUserCourses(userId);

        return userCourses;
    }

    async createdCourses(userId: number): Promise<PartialCourseInfo[]>{
        const coursesCreated = await userDB.getCreatedCourses(userId);

        return coursesCreated;
    }

    async leave(userId: number, courseId: number): Promise<FullCourseInfo>{
        const courseToLeave = await courseDB.getCourse(courseId);
        const userCourses = await userDB.getUserCourses(userId);

        if (!courseToLeave){
            throw new NotFoundError('Course not found');
        }

        // Look if user is enrolled in the course
        if (!userCourses.some(c => c.id === courseId)){
            throw new NotFoundError(`Can't leave a course before enrolling to it`);
        }

        const courseLeft = await userDB.leaveCourse(userId, courseId);

        return courseLeft;
    }
}

export default new UserService();