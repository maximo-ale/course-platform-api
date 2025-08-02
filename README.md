# Course Platform API

A complete RESTful API for a course platform, built with Node.js, Express, and MongoDB. Includes user authentication, role-based authorization, course management, and enrollment features.

## Techs Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
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

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Users
- `GET /users` – Admin only
- `DELETE /users/:id` – Admin only
- `GET /me/courses` – User’s enrolled courses

### Courses
- `GET /courses` – View all published (user), or all (admin/teacher)
- `POST /courses` – Create course (teacher/admin)
- `PATCH /courses/:id` – Update own course (teacher) or any (admin)
- `DELETE /courses/:id` – Delete course (admin)

### Enrollment
- `POST /courses/:id/enroll` – Enroll in a course
- `GET /me/courses` – View enrolled courses

## Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/course-platform-api.git
   cd course-platform-api

2. **Install dependencies**
    npm install

3. **Create a '.env' file**
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret

4. **Run the server**
    npm run dev

## Deployment & Testing
The API is deployed and running on Render at:
https://course-platform-api-8owy.onrender.com

You can test all endpoints live using Postman or any HTTP client by replacing your local URLs with the above URL.

Note: The first request after a period of inactivity might take a few seconds due to Render’s server cold start.

## Future Improvements
- Filtering and pagination
- Course ratings and comments
- File uploads for course materials
- Email verification & password reset
- Admin dashboard (frontend)

## Author
- Máximo Ale - Backend developer in training.