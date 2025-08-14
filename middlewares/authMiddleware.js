const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message: 'No token'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.userId;
        req.userCourses = decoded.userCourses;

        // Only users from the DB
        const userInDB = await User.findById(decoded.userId);
        if (!userInDB){
            return res.status(403).json({message: 'Invalid token'});
        }
        
        next();
    } catch {
        return res.status(403).json({message: 'Invalid token'});
    }
}
const teacherAuth = (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin'){
        return res.status(403).json({message: 'Not authorized'});
    }
    next();
}
const onlyAdmin = (req, res, next) => {
    if (req.user.role !== "admin"){
        return res.status(403).json({message: 'Not authorized'});
    }
    next();
}
module.exports = {auth, teacherAuth, onlyAdmin}