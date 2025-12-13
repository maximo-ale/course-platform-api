import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import authDB from "../auth/authRepository.js";
import userDB from "../user/userRepository.js";
import courseDB from "./courseRepository.js"

interface CreateCourse{
    title: string,
    description?: string,
    category: string | string[],
    teacher: number,
    price: number,
    published: boolean,
}

interface UpdateCourse{
    title?: string,
    description?: string,
    teacher?: string,
    category?: string | string[],
    price?: number,
    published?: boolean,
}

interface FullCourseInfo{
    id: number,
    title: string,
    description: string,
    teacher: number,
    students: number[],
    category: string | string[],
    price: number,
}

interface PartialCourseInfo{
    title: string,
    teacher: string,
}

interface Filter{
    title?: string,
    teacher?: string,
    category?: string | string[],
    minPrice?: number,
    maxPrice?: number,
    sort?: string,
}

interface Pagination{
    page: number,
    limit: number,
}

class CourseService{
    async getCoursesForUsers(filters: Filter, pages: Pagination){
        const {title, teacher, category, minPrice, maxPrice, sort} = filters;
        let {page, limit} = pages;

        let pageNumber = page ? page : 1;
        let pageLimit = limit;

        if (pageLimit){
            if (pageLimit <= 0) pageLimit = 1;
            else if (pageLimit > 10) pageLimit = 10;
        }

        const filter: Filter = {};
        const pageConfig: Pagination = {page, limit};
        
        if (title) filter.title = title;
        if (teacher) filter.teacher = teacher;
        if (category) filter.category = category;
        if (sort) filter.sort = sort;
        if (minPrice) filter.minPrice = minPrice;
        if (maxPrice) filter.maxPrice = maxPrice;

        pageConfig.limit = pageNumber | 10;
        pageConfig.page = pageLimit | 1;

        const courses: PartialCourseInfo[] = await courseDB.getCoursesForUsers({...filter, ...pageConfig});

        return { courses, page: page | 1, limit: limit | 10 };
    }

    async getCourse(courseId: number): Promise<FullCourseInfo>{
        const course = await courseDB.getCourse(courseId);
        if (!course){
            throw new NotFoundError('Course not found');
        }

        return course;
    }

    async getAllCourses(): Promise<FullCourseInfo[]>{
        return await courseDB.getAllCourses();
    }

    async createCourse(data: CreateCourse, userId: number): Promise<FullCourseInfo>{
        const {
            title,
            category,
            price,
            published,
        } = data;
        
        let { description } = data;

        const teacher = userId;
        if (!description){
            description = '';
        }

        // Creates new course
        const newCourse = await courseDB.createCourse({
            title,
            description,
            teacher,
            category,
            price,
            published: published || true,
        });

        return newCourse;
    }

    async updateCourse(courseId: number, data: UpdateCourse): Promise<FullCourseInfo>{
        const {teacher} = data;

        if (teacher){
            throw new BadRequestError('Teachers cannot be modified here');
        }

        // Update course and save it
        const course = await courseDB.updateCourse(courseId, data);
        
        if (!course) {
            throw new NotFoundError('Course not found');
        }

        return course;
    }

    async removeStudent(userId: number, courseId: number){
        const studentToRemove = await authDB.findUserById(userId);
        const course = await courseDB.getCourse(courseId);
        const userCourses = await userDB.getUserCourses(userId);

        // If any of them is undefined or the student is not enrolled in the course, return.
        if (!studentToRemove) {
            throw new NotFoundError('User not found');
        }
        if (!course) {
            throw new NotFoundError('Course not found');
        }
        if (!userCourses.some(c => c.id === courseId)){
            throw new BadRequestError('User is not enrolled in this course');
        }

        await courseDB.removeStudent(userId);
    }

    async deleteCourse(courseId: number): Promise<FullCourseInfo>{
        const deletedCourse = await courseDB.deleteCourse(courseId);

        if (!deletedCourse) {
            throw new NotFoundError('Course not found');
        }

        return deletedCourse;
    }
}

export default new CourseService();