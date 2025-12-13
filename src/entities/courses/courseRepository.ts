import pool from "../../config/db.js";

interface Filters{
    title?: string,
    teacher?: string,
    category?: string | string[],
    sort?: string,
    minPrice?: number,
    maxPrice?: number,
    page: number,
    limit: number,
}

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

interface PartialCourseInfo{
    title: string,
    teacher: string,
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

class CourseRepository{
    async getCoursesForUsers(filters: Filters): Promise<PartialCourseInfo[]>{
        let fields = ['published = $1'];
        let values: (number | string | string[] | boolean)[] = [true];
        let idx = 2;

        let query: string = `SELECT * FROM courses WHERE `;

        if (filters.title){
            fields.push(`title LIKE $${idx}`);
            values.push(`%${filters.title}%`);
            idx++;
        }

        if (filters.category){
            if (typeof filters.category === 'string'){
                fields.push(`category = $${idx}`);
                values.push([filters.category]);
                idx++
            } else {
                for (let i = 0; i < filters.category.length; i++){
                    fields.push(`category = $${idx}`);
                    values.push([filters.category[i]]);
                    idx++
                }
            }
        }

        if (filters.minPrice){
            fields.push(`price >= $${idx}`);
            values.push(filters.minPrice);
            idx++;
        }

        if (filters.maxPrice){
            fields.push(`price <= $${idx}`);
            values.push(filters.maxPrice);
            idx++;
        }

        if (filters.teacher){
            fields.push(`teacher = $${idx}`);
            values.push(filters.teacher);
            idx++;
        }

        if (fields.length > 0){
            query += `${fields.join(' AND ')}`
        }

        query += ` LIMIT ${filters.limit - 1} OFFSET ${filters.page - 1}`

        const courses = await pool.query(query, values);

        return courses.rows;
    }

    async getAllCourses(): Promise<FullCourseInfo[]>{
        const allCourses = await pool.query(`
            SELECT * FROM courses`);
        return allCourses.rows;
    }
    async getCourse(courseId: number): Promise<FullCourseInfo>{
        const course = await pool.query(`
            SELECT *
            FROM courses c
            JOIN users u ON c.teacher = u.id
            WHERE c.id = $1 AND published = true
            `, [courseId]);
        return course.rows[0];
    }

    async createCourse(data: CreateCourse): Promise<FullCourseInfo>{
        const {title, description, teacher, category, price, published} = data
        const course = await pool.query(`
            INSERT INTO courses (title, description, teacher, category, price, published)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `, [title, description, teacher, [category], price, published]);

        return course.rows[0];
    }

    async updateCourse(courseId: number, data: UpdateCourse): Promise <FullCourseInfo>{
        let fields = [];
        let values: (string | number | boolean)[] = [courseId];
        let idx = 2;

        for (const [key, value] of Object.entries(data)){
            if (value !== undefined){
                fields.push(`${key} = $${idx}`);
                values.push(value);
                idx++;
            }
        }

        let query = `UPDATE courses SET ${fields.join(', ')}
                     WHERE id = $1
                     RETURNING *;`;

        const course = await pool.query(query, values);

        return course.rows[0];
    }

    async removeStudent(userId: number){
        await pool.query(`
            DELETE FROM users_courses WHERE user_id = $1
            `, [userId]
        );
    }

    async deleteCourse(courseId: number): Promise<FullCourseInfo>{
        const deletedCourse = await pool.query(`
            DELETE FROM courses
            WHERE id = $1
            RETURNING *
            `, [courseId]);
        return deletedCourse.rows[0];
    }
}

export default new CourseRepository();