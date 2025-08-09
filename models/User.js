const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"],
    },
    role: {
        type: String,
        enum: ['user', 'teacher', 'admin'],
        default: 'user',
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course',
    }]
}, {
    timestamps: true,
});

module.exports = model('User', userSchema);