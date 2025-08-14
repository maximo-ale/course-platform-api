# Course Platform API

A complete RESTful API for a course platform, built with Node.js, Express, and MongoDB. Includes user authentication, role-based authorization, course management, and enrollment features.

## Quick Start

1. Clone the repository
- git clone https://github.com/maximo-ale/course-platform-api.git
- cd course-platform-api

2. Install dependencies
- npm install

3. Copy '.env.example' to '.env'
- On Windows CMD:
copy .env.example .env
- On Windows PowerShell:
Copy-Item .env.example .env
- On Linux/macOS:
cp .env.example .env

4. The '.env' file already includes a test user and a public database:
- PORT=3000
- MONGO_URI=mongodb+srv://testUser:testPassword@cluster.uzqisyr.mongodb.net/?
- JWT_SECRET=JWT_example

4. Start the server
- npm start

## Deployment & Testing
The API is deployed and running on Render at:
https://course-platform-api-8owy.onrender.com

You can test all endpoints live using Postman or any HTTP client by replacing your local URLs with the above URL.

Note: The first request after a period of inactivity might take a few seconds due to Render’s server cold start.

## Techs Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens
- bcrypt
- Postman

## Features

### Authentication & Security
- User registration and login.
- Authentication using JWT to secure route access.
- bcrypt to hash passwords.
- 3 main roles with diferent authorization (`user`, `teacher`, `admin`).

### Courses
- Courses are created, edited and deleted by admins and teachers.
- Courses include title, description, category, price, published status, and assigned teacher.
- Regular users can view only published courses.

### Enrollment
- Users can enroll in courses.
- Prevents multiple enrollments in the same course.
- Users can view all their enrolled courses.

### Admin Controls
- Admin can delete users and courses.
- Admin has access to all protected routes.
- Role-specific middlewares for fine-grained control.

## Proyect Structure

- Config
- Controllers
- Middlewares
- Models
- Node_modules
- Routes
- Utils
- server.js
- .env (ignored)

## Available Endpoints

## Auth

| Method | Endpoint                | Description                    |
|--------|-------------------------|-------------------------------|
| GET    | /api/auth/showUsers      | Show all users (admin only)   |
| POST   | /api/auth/register       | Register a new user            |
| POST   | /api/auth/login          | User login                    |
| DELETE | /api/auth/delete/:id     | Delete a user by ID (admin)   |

## Courses

| Method | Endpoint                                     | Description                        |
|--------|----------------------------------------------|----------------------------------|
| GET    | /api/courses/get                             | Get courses for logged user       |
| GET    | /api/courses/getAll                          | Get all courses (admin only)      |
| GET    | /api/courses/get/:id                         | Get course by ID                  |
| POST   | /api/courses/create                          | Create a course (teacher only)    |
| DELETE | /api/courses/delete/:id                      | Delete a course by ID (teacher)   |
| DELETE | /api/courses/delete/:courseId/student/:userId | Remove a student from a course    |
| PATCH  | /api/courses/modify/:id                      | Modify a course by ID (teacher)   |

## User

| Method | Endpoint                 | Description                         |
|--------|--------------------------|-----------------------------------|
| POST   | /api/user/enroll/:id     | Enroll logged user to a course    |
| GET    | /api/user/courses        | Show courses user is enrolled in  |
| GET    | /api/user/created        | Show courses created by teacher   |
| DELETE | /api/user/leave/:id      | Leave a course                    |

## Author
Developed by Máximo Ale
Contact: maximoale20000@gmail.com