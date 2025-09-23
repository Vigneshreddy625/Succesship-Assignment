# MERN Stack CRUD Application with User Authentication

A simple **MERN Stack (MongoDB, Express.js, React.js, Node.js)** application implementing **user signup, login, edit profile, and delete account** functionality with JWT-based authentication.

---

## 🚀 Features

- ✅ User Signup  
- ✅ User Login with JWT Authentication  
- ✅ Edit User Profile  
- ✅ Delete User Account  
- ✅ Protected Routes  
- ✅ Responsive UI (React + Tailwind CSS)

---

## 🧱 Tech Stack

| Frontend       | Backend              | Database          |
|--------------|----------------------|------------------|
| React.js     | Node.js + Express.js | MongoDB (Mongoose) |
| Tailwind CSS | JWT Authentication    | MongoDB Atlas or Local |

---

## ⚡️ Installation

### 1️⃣ Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mern-crud-auth.git
cd Backend

# Install dependencies
npm install

# start backend development server
npm run dev

cd ../Frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev

```

## .env

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

## API Endpoints

| Method | Endpoint                    | Description                     |
| ------ | --------------------------- | ------------------------------- |
| POST   | /api/v1/users/register      | Create a new user account       |
| POST   | /api/v1/users/login         | User login and receive JWT      |
| GET    | /api/v1/users/current-user  | Get user profile (protected)    |
| PATCH  | /api/v1/users/update-details| Edit user profile (protected)   |
| DELETE | /api/users/delete -user/:id | Delete user account (protected) |

## Authentication

JWT Authentication


