const Course = require('../models/Course');

// Verify if teacher is modifying its own course
const teacherValidator = (courseIdParam = 'id') => {
    return async (req, res, next) => {
            try {
                if (req.user.role !== 'teacher' && req.user.role !== 'admin'){
                    return res.status(403).json({message: 'Not authorized'});
                }

                const course = await Course.findById(req.params[courseIdParam]);
                if (!course){
                    return res.status(400).json({message: 'Course not found'});
                }

                if (req.user.role === 'teacher' && course.teacher.toString() !== req.userId){
                    return res.status(403).json({message: `Unauthorized to modify other teacher's course`});
                }

                req.course = course;
                next();
            } catch (err) {
                console.log(err);
                return res.status(500).json({message: 'Internal server error'});
            }
        }
}
module.exports = teacherValidator;