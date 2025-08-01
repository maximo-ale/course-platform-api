require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
    } catch (err) {    
        console.error('Connection failed', err);
        process.exit(1);
    }
}

module.exports = connectDB;