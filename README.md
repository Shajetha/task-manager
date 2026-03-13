# MERN Task Manager

A full-stack **Task Management Web Application** built using the **MERN Stack (MongoDB, Express.js, React, Node.js)**.  
The application allows users to **register, login, create tasks, update task status, search tasks, and manage productivity efficiently**.

---

# Features

- User Authentication (Register & Login)
- JWT Based Authorization
- Create Tasks
- Update Tasks
- Delete Tasks
- Mark Tasks as Completed
- Search Tasks
- Pagination for Task List
- Task Statistics Dashboard
- Protected API Routes
- RESTful API Architecture

---

# Tech Stack

## Frontend

- React.js
- Axios
- React Context API
- CSS / Bootstrap

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose ODM

## Authentication

- JSON Web Token (JWT)
- bcryptjs for password hashing

---

# Project Structure

task-manager/

backend/
controllers/
authController.js
taskController.js

middleware/
authMiddleware.js

models/
User.js
Task.js

routes/
authRoutes.js
taskRoutes.js

config/
db.js

server.js

frontend/
components/
context/
pages/
utils/
api.js

App.js

README.md

---

# Installation

## Clone the repository

git clone https://github.com/Shajetha/task-manager.git
cd task-manager

---

## Install Backend Dependencies

cd backend
npm install

---

## Install Frontend Dependencies

cd frontend
npm install
---

# Environment Variables

Create a `.env` file inside **backend** folder.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

---

# Run the Application

## Start Backend

cd backend
npm run dev
Server will run on:
http://localhost:5000

---

## Start Frontend

cd frontend
npm run dev
Frontend will run on:
http://localhost:5173

---

# API Endpoints

## Authentication

POST /api/auth/register → Register user
POST /api/auth/login → Login user

---

## Tasks

GET /api/tasks → Get all tasks
POST /api/tasks → Create task
GET /api/tasks/:id → Get single task
PUT /api/tasks/:id → Update task
DELETE /api/tasks/:id → Delete task

---

# Task Features

- Search tasks by title or description
- Filter tasks by status (pending / completed)
- Pagination support
- User-specific task isolation

---

# security

- Password hashing using bcrypt
- JWT authentication
- Protected routes using middleware
- User-specific task access control

---

# Future Improvements

- Task priority levels
- Due date reminders
- Drag-and-drop task boards
- Dark mode UI
- Email notifications
- Mobile responsive design

---
