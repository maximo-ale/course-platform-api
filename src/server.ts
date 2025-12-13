import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import authRoutes from './entities/auth/authRoutes.ts'
import courseRoutes from './entities/courses/courseRoutes.ts';
import userRoutes from './entities/user/userRoutes.ts';
import errorHandler from './middlewares/errorHandler.ts';
import createTables from './utils/createTables.ts';
import resetDB from './utils/resetDB.ts';

const PORT: string | number = process.env.PORT || 3000;

if (process.env.RESET_DB_ON_START?.toLowerCase() === "true"){
    await resetDB();
}

await createTables();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
