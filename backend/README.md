# Task Manager - Backend API

Node.js/Express backend API for the Task Manager application with SQLite database and JWT authentication.

## Features

    - User Authentication (Signup/Login)
    - JWT-based Security
    - Task CRUD Operations
    - Search & Filtering
    - SQLite Database
    - CORS Enabled
    - Input Validation

## Tech Stack

    - Runtime: Node.js
    - Framework: Express.js
    - Database: SQLite
    - Authentication: JWT
    - Password Hashing: bcrypt
    - Environment Variables: dotenv


## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend

2. **Install dependencies**:
    npm install

3. **Create environment file**:
    cp .env.example .env


## Environment Variables
    Create a .env file in the root directory:

        PORT=5000
        NODE_ENV=development
        JWT_SECRET=your_super_secure_jwt_secret_key_here
        JWT_EXPIRES_IN=7d
        FRONTEND_URL=http://localhost:3000
        DATABASE_PATH=./database/db.sqlite

## API Endpoints

**Authentication Routes**
Method:	    Endpoint:	        Description: 

POST	    /api/auth/signup	Register new user	
POST	    /api/auth/login	    User login	        
GET	        /api/auth/profile	Get user profile    -

**Task Routes (Require Authentication)**
Method:     Endpoint:	    Description:

GET	        /api/tasks	    Get user tasks	
POST	    /api/tasks	    Create new task	
PUT	        /api/tasks/:id	Update task	
DELETE	    /api/tasks/:id	Delete task

## Authentication
    -JWT tokens are required for all task routes
    -Include token in Authorization header: Bearer <token>
    -Tokens expire after 7 days (configurable)