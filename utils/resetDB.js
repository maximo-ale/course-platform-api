const Course = require("../models/Course");
const User = require("../models/User")

const resetDB = async() => {
    await User.deleteMany();
    await Course.deleteMany();
}

module.exports = resetDB;