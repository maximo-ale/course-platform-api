const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is mandatory"],
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Description is mandatory"],
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    category: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    published: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

module.exports = model('Course', courseSchema);