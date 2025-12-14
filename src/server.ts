import express from 'express';
const app = express();

import authRoutes from './entities/auth/authRoutes.js'
import courseRoutes from './entities/courses/courseRoutes.js';
import userRoutes from './entities/user/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import createTables from './utils/createTables.js';

import waitForDB from './utils/waitForDB.js';
import resetDB from './utils/resetDB.js';

const PORT: string | number = process.env.PORT || 3000;

await waitForDB();

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
