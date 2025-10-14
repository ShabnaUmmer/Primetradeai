# Task Manager - Frontend

React.js frontend application for the Task Manager with responsive design and Bootstrap styling.

## Features

    - User Authentication (Login/Signup)
    - Task Management (CRUD Operations)
    - Search Tasks by Title
    - Filter Tasks by Status
    - Responsive Design (Mobile & Desktop)
    - JWT Authentication
    - Bootstrap UI Components

## Tech Stack

- **Framework**: React.js
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Framework**: Bootstrap 
- **State Management**: React Component State


## Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend

2. **Insall dependencies**
    npm install

3. **Running the Application**
    npm start

## Component Overview

**Authentication Components**
    -LoginForm: User login with email and password
    -SignupForm: User registration with name, email, and password

**Main Application Components**
    -Dashboard: Main layout with task form and task list
    -TaskForm: Form to create new tasks
    -TaskList: Displays tasks with edit/delete functionality

**Page Components**
    -Home: Landing page with login/signup links
    -Profile: User profile page with edit functionality(Only Fullname can edit) 

## Features 

**User Authentication**
    -JWT token storage in localStorage
    -Automatic token inclusion in API requests
    -Redirect to login on token expiration

**Task Management**
    -Create: Add new tasks with title, description, and status
    -Read: View all tasks with search and filtering
    -Update: Edit task details inline
    -Delete: Remove tasks with confirmation

**Search & Filter**
    -Search: Real-time search by task title
    -Filter: Filter by task status (All, Pending, In Progress, Completed)
    -Clear Filters: Reset all filters

## API Integration

**Service Layer**

The **src/services/api.js** file handles all API communication:

## DEployment - VERCEL