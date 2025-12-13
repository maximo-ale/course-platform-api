import type { Request } from 'express';

interface User{
    role?: 'user' | 'teacher' | 'admin',
}

declare module 'express-serve-static-core'{
    interface Request{
        userId?: string,
        role?: 'user' | 'teacher' | 'admin',
    }
}