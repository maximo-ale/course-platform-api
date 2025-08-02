const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    const {name, email, password, role} = req.body;

    // Validate role if provided
    const validRoles = ['user', 'teacher', 'admin'];
    if (req.body.role && !validRoles.includes(req.body.role)){
        return res.status(400).json({message: 'Invalid role value'});
    }

    // Check required fields are present
    if (!name || !email || !password
        || name.trim() === "" || email.trim() 
        === "" || password.trim() === "")
    {
        return res.status(400).json({message: 'Invalid information'});
    }
    try {
        // Hash password to protect valuable data
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await newUser.save();

        // Prepare user response without providing sensitive info
        const userResponse = {
            id: newUser._id,
            name,
            email,
            role,
        };
        res.status(201).json({
            message: 'User saved successfully',
            userResponse,
        });
    } catch (err) {
        // Handle duplicate key error
        if (err.code === 11000){
            return res.status(400).json({message: "Name and email must be unique"});   
        }
        console.log(err);
        return res.status(500).json({message: 'Internal error'});
    }
}
exports.login = async(req, res) => {
    const {name, email, password} = req.body;

    try {
        // Find user by name or email
        const user = await User.findOne({
            $or: [
                {name},
                {email},
            ]
        });

        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        // Compare given password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Wrong password'});
        }

        // Generate JWT
        token = generateToken({userId: user._id, role: user.role});

        // Prepare user response without sensitive info
        const userResponse = {
            id: user._id,
            name,
            email,
            role: user.role,
        };
        
        res.status(200).json({
            token,
            user: userResponse
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Deletes a user by ID, also removes the user from all the courses they are enrolled in
exports.deleteUser = async(req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
    
        if (!userToDelete){
            return res.status(404).json({message: 'User not found'});
        }

        const userCourses = userToDelete.courses || [];

        // Delete user from all the courses they are enrolled in
        for (let courseId of userCourses){
            const course = await Course.findById(courseId);
            if (!course) continue;
            course.students = course.students.filter(
                studentId => !studentId.equals(userToDelete._id)
            )
            // Save course info
            await course.save();
        }

        // Delete the user document
        const deleteUser = await User.findByIdAndDelete(req.params.id);

        // Prepare response without sensitive info
        const userResponse = {
            id: deleteUser._id,
            email: deleteUser.email,
            name: deleteUser.name,
            role: deleteUser.role,
        };
        res.status(200).json({
            message: 'User deleted successfully',
            deletedUser: userResponse,
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}
exports.showUsers = async(req, res) => {
    try {
        // Prepare response without providing sensitive info
        const users = await User.find({}, {name: 1, email: 1, role: 1});

        res.status(200).json({
            message: 'Users found',
            users,
        })
    } catch (err){
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}
exports.deleteUsers = async(req, res) => {
    try {
        const result = await User.deleteMany();
        res.status(200).json({
            message: 'Users deleted successfully',
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}