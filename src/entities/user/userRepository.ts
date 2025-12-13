import pool from "../../config/db.js";

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

class UserRepository{
    async enroll(userId: number, courseId: number): Promise<FullCourseInfo>{
        const courseEnrolled = await pool.query(`
            INSERT INTO users_courses (user_id, course_id)
            VALUES ($1, $2);
            `, [userId, courseId]);
        return courseEnrolled.rows[0];
    }

    async getUserCourses(userId: number): Promise<PartialCourseInfo[]>{
        const courses = await pool.query(`
            SELECT c.id
            FROM courses c
            JOIN users_courses uc ON c.id = uc.course_id
            WHERE uc.user_id = $1;
            `, [userId]
        );

        return courses.rows;
    }

    async getCreatedCourses(userId: number): Promise<PartialCourseInfo[]>{
        const coursesCreated = await pool.query(`
            SELECT *
            FROM courses c
            JOIN users_courses uc ON c.id = uc.course_id
            WHERE c.teacher = $1;
            `, [userId]
        );

        return coursesCreated.rows;
    }

    async leaveCourse(userId: number, courseId: number): Promise<FullCourseInfo>{
        const course = await pool.query(`
            DELETE
            FROM users_courses uc
            WHERE uc.user_id = $1 AND uc.course_id = $2
            RETURNING *;
            `, [userId, courseId]
        );

        return course.rows[0];
    }
}

export default new UserRepository();