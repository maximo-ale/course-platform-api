const Course = require('../models/Course');
const User = require('../models/User');

// Get all published courses (visible to any authenticated user)
exports.getCoursesForUsers = async(req, res) => {
    try {
        const {title, teacher, category, sort} = req.query;
        let {page, limit} = req.query;
        const filter = {};

        page = parseInt(page);
        limit = parseInt(limit);
        if (limit <= 0) limit = 1;
        if (limit > 10) limit = 10;

        if (title) filter.title = new RegExp(title, 'i');
        if (teacher) filter.teacher = teacher;
        if (category) filter.category = category

        let query = Course.find({...filter, published: true});

        if (sort){
            const sortParams = sort.split(',').join(' ');
            query = query.sort(sortParams);
        }

        query = query
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('teacher', 'name email')

        const courses = await query;
        
        res.status(200).json({
            message: 'Courses found',
            page,
            limit,
            count: courses.length,
            courses,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    };
}

// Get all the courses, including unpublished ones (only for admins)
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            message: 'Courses found',
            courses,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    };
}

// Return a specific course by ID and include teacher's info.
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findOne({_id: req.params.id, published: true}).populate('teacher');
        if (!course){
            return res.status(404).json({message: 'Course not found'});
        }

        res.status(200).json({
            message: 'Course found successfully',
            course,
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Create a new course (only accessible to admins and teachers)
exports.createCourse = async (req, res) => {
    const {
        title,
        description,
        category,
        price,
        published,
    } = req.body;

    const teacher = req.userId;

    // Check if any field is missing
    if (!title || !description || !category || price == null
        || title.trim() === "" || description.trim() === ""
        || category.trim() === ""
    ){
        return res.status(400).json({message: 'Missing mandatory fields'});
    }

    // Validate price is a number
    if (typeof price != 'number' || price < 0){
        return res.status(400).json({message: 'Price must be a positive number'});
    }
    try {
        // Creates new course
        const newCourse = new Course({
            title,
            description,
            teacher,
            category,
            price,
            published,
        });

        await newCourse.save();

        res.status(201).json({message: 'Course created successfully'});

    } catch (err) {
        // Handle duplicate key error
        if (err.code === 11000){
            return res.status(400).json({message: "Title must be unique"});
        }
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Teachers may modify only their courses, but admins can modify any course.
exports.modifyCourse = async (req, res) => {

    const {title, description, category, price} = req.body;

    // Validate input fields
    if (title?.trim() === "" ||
        description?.trim() === "" || 
        category?.trim() === "" || 
        (price !== undefined && typeof price !== 'number')
    ){
        return res.status(400).json({message: 'Missing or invalid mandatory fields'});
    }

    try {
        // Update course and save it
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true, runValidators: true},
        );
        
        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }
        
        res.status(200).json({
            message: 'Course successfully updated',
            course,
        });
    } catch (err) {
        if (err.code === 11000){
            return res.status(400).json({message: 'Title must be unique'});
        }
        console.error(err);
        return res.status(500).json({message: 'Internal error'});
    }
}

// Remove a student from a course (only available to admins and teachers) 
exports.deleteStudent = async (req, res) => {
    // Get student and course
    try {
        const studentToDelete = await User.findById(req.params.userId);
        const course = await Course.findById(req.params.courseId);

        // If any of them is undefined or the student is not enrolled in the course, return.
        if (!studentToDelete) {
            return res.status(404).json({message: 'User not found'});
        }
        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }
        if (!studentToDelete.courses.includes(req.params.courseId)) {
            return res.status(400).json({message: 'User is not enrolled in this course'});
        }
        // Remove course from student's list
        studentToDelete.courses = studentToDelete.courses.filter(
            courseId => !courseId.equals(req.params.courseId)
        );
        // Remove student from course's list
        course.students = course.students.filter(
            studentId => !studentId.equals(req.params.userId)
        );

        // Save
        await course.save();
        await studentToDelete.save();

        res.status(200).json({message: 'User removed successfully'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Teachers may delete their course. Admins may delete any.
exports.deleteCourse = async (req, res) => {
    try {
        const courseToDelete = await Course.findById(req.params.id);
        if (!courseToDelete) {
            return res.status(400).json({message: 'Course does not exist'});
        }

        const students = courseToDelete.students || [];

        // Remove the course from all of the students enrolled
        for (let studentId of students) {
            const student = await User.findById(studentId);
            if (!student) continue;
            student.courses = student.courses.filter(
                course => !course.equals(courseToDelete._id)
            );

            // Save user
            await student.save();
        }

        // Delete course
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Successfully deleted course',
            course: courseToDelete,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal error'});
    }
}

// Delete all courses (only available to admins)
exports.deleteCourses = async (req, res) => {
    try {
        await Course.deleteMany();
        res.status(200).json({message: 'Courses deleted successfully'});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal error'});
    }
}