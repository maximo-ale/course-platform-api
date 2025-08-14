const User = require('../models/User');
const Course = require('../models/Course');

// Enroll in a course
exports.enroll = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('courses');
        const courseToEnroll = await Course.findById(req.params.id);

        if (!courseToEnroll) {
            return res.status(404).json({message: 'Course does not exist'});
        } 

        // Look if user is already enrolled in the course
        if (user.courses.includes(courseToEnroll._id)){
            return res.status(400).json({message: 'Already enrolled'});
        }

        // Add course to student's courses list
        user.courses.push(courseToEnroll._id);

        // Add student to course's students list
        courseToEnroll.students.push(user._id);

        await user.save();
        await courseToEnroll.save();

        res.status(200).json({
            message: 'Successfully enrolled',
            course: {
                _id: courseToEnroll._id,
                title: courseToEnroll.title,
                category: courseToEnroll.category,
                teacher: courseToEnroll.teacher, 
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Get all the courses the user is enrolled in
exports.showEnrolled = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'courses',
            select: 'title teacher published category',
        });
        res.status(200).json({
            message: 'Courses found',
            courses: user.courses
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Get created courses (only available to teachers and admins)
exports.showCreated = async (req, res) => {
    try {
        const createdCourses = await Course.find({teacher: req.userId});

        res.status(200).json({
            message: 'Created courses found',
            createdCourses,
        });    
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Leave a course
exports.leave = async(req, res) => {
    try {
        const courseToLeave = await Course.findById(req.params.id);
        const user = await User.findById(req.userId);

        if (!courseToLeave){
            return res.status(404).json({message: 'Course not found'});
        }
        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        // Look if user is enrolled in the course
        if (!user.courses.includes(req.params.id)){
            return res.status(400).json({message: `Can't leave a course before enrolling to it`});
        }

        // Remove course from user
        courseToLeave.students = courseToLeave.students.filter(
            student => !student.equals(req.userId)
        );

        // Remove student from course
        user.courses = user.courses.filter(
            course => !course.equals(req.params.id)
        );

        await courseToLeave.save();
        await user.save();
        res.status(200).json({
            message: 'Course left',
            course: {
                _id: courseToLeave._id,
                title: courseToLeave._id,
                category: courseToLeave._id,
                teacher: courseToLeave.teacher,
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}