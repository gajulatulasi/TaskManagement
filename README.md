# Team Task Manager

A full-stack, responsive web application for managing projects and tracking team tasks, built strictly to assignment constraints. It features a premium, SaaS-style UI with Framer Motion animations and robust Role-Based Access Control (RBAC).

## Features

### Role-Based Access
- **Admin**: Create projects, manage team members, assign tasks, delete projects/tasks, and view global dashboard analytics.
- **Member**: View assigned tasks, update task statuses (Todo, In Progress, Done). Restricted from creating/deleting projects or assigning tasks.

### Core Functionality
- **Authentication**: Secure JWT-based auth with bcrypt password hashing.
- **Projects**: Create projects, manage members, view detailed project breakdowns.
- **Tasks**: Priority tracking (Low, Medium, High), status tracking, deadline management, and filtering.
- **Dashboard**: Global task analytics with automatic overdue calculations (`dueDate < current date AND status != Done`), and a visual Recharts Pie chart distribution.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router v6.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas, Mongoose.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URL

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd team-task-manager
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## Folder Structure
```
team-task-manager/
├── client/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Layout, ProtectedRoute)
│   │   ├── pages/       # Route-level components (Dashboard, Tasks, Projects, etc)
│   │   └── utils/       # Global animation variants
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── config/          # Database connection
    ├── controllers/     # Route logic (auth, projects, tasks, dashboard)
    ├── middleware/      # JWT and RBAC protection
    ├── models/          # Mongoose schemas
    ├── routes/          # Express API definitions
    └── package.json
```
