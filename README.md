# CodeB MIS InvoicePro

CodeB MIS InvoicePro is a full-stack Invoice Management System built using the MERN stack.  
The project demonstrates authentication, role-based access control, and secure frontend-backend integration using MongoDB Atlas.

---

## 1. Project Overview

This application is designed to manage users and business operations securely.  
It includes authentication, protected routes, and role-based authorization.

The goal of this project is to implement a production-ready backend and a structured frontend architecture following industry standards.

---

## 2. Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- Context API
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- Cookie Parser
- CORS
- Dotenv

---

## 3. Project Structure

# File Tree: CodeB_MIS_InvoicePro

**Generated:** 2/24/2026, 7:03:36 PM
**Root Path:** `d:\CodeB_MIS_InvoicePro`

```
├── 📁 backend
│   ├── 📁 config
│   │   └── 📄 db.js
│   ├── 📁 controllers
│   │   └── 📄 authController.js
│   ├── 📁 middleware
│   │   ├── 📄 authMiddleware.js
│   │   └── 📄 roleMiddleware.js
│   ├── 📁 models
│   │   └── 📄 User.js
│   ├── 📁 routes
│   │   └── 📄 authRoutes.js
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   └── 📄 server.js
├── 📁 database
├── 📁 docs
├── 📁 frontend
│   ├── 📁 public
│   │   └── 🖼️ vite.svg
│   ├── 📁 src
│   │   ├── 📁 animations
│   │   ├── 📁 api
│   │   │   └── 📄 axios.js
│   │   ├── 📁 assets
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 components
│   │   │   └── 📁 layout
│   │   │       ├── 📄 MainLayout.jsx
│   │   │       └── 📄 Sidebar.jsx
│   │   ├── 📁 config
│   │   ├── 📁 context
│   │   │   └── 📄 AuthContext.jsx
│   │   ├── 📁 hooks
│   │   ├── 📁 pages
│   │   │   ├── 📄 Dashboard.jsx
│   │   │   ├── 📄 Invoices.jsx
│   │   │   └── 📄 Login.jsx
│   │   ├── 📁 routes
│   │   │   ├── 📄 AppRoutes.jsx
│   │   │   └── 📄 ProtectedRoute.jsx
│   │   ├── 📁 services
│   │   │   └── 📄 api.js
│   │   ├── 📁 styles
│   │   ├── 📁 utils
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.jsx
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 postcss.config.js
│   └── 📄 vite.config.js
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ package-lock.json
└── ⚙️ package.json
```

---

---

## 4. Features Implemented

- MongoDB Atlas database integration
- User registration
- User login
- JWT-based authentication
- Protected API routes
- Role-based access control
- CORS configuration for frontend-backend communication
- Context API for authentication state management

---

## 5. Installation Guide

### Clone the Repository

https://github.com/Om101101/CodeB_MIS_InvoicePro.git

---

### Backend Setup

cd backend
npm install
npm run dev

Create a `.env` file inside the backend folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Backend runs on: http://localhost:5000

---

### Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on: http://localhost:5173

---

## 6. API Endpoints

### Authentication Routes

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

---

## 7. NPM Dependencies

### Backend Dependencies

- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- cookie-parser

### Frontend Dependencies

- react
- react-router-dom
- axios
- vite
- tailwindcss

---

## 8. Development Status

The project is currently under active development.  
Upcoming features include:

- Admin dashboard
- Sales dashboard
- Customer management
- Product management
- Invoice generation
- Reporting and analytics

---

## 9. Author

Om Jaiswal  
Full Stack MERN Developer
