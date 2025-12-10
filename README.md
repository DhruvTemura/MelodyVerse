# 🎵 MelodyVerse - Full Stack Authentication App

A complete authentication system for a fictional music streaming platform built with React.js (frontend) and Node.js (backend) with JWT authentication.

## 📋 Project Overview

MelodyVerse is a full-stack web application that implements secure user authentication with:
- User registration and login
- JWT-based authentication
- Password reset functionality
- Responsive modern UI
- Comprehensive testing

## 🚀 Features

### Backend (Node.js + Express)
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ Secure password hashing with bcrypt
- ✅ JWT token generation and validation
- ✅ Input validation and sanitization
- ✅ Password reset with token expiration
- ✅ Comprehensive error handling
- ✅ API tests with Jest + Supertest

### Frontend (React.js)
- ✅ Modern responsive UI with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Client-side form validation
- ✅ Protected routes
- ✅ Remember me functionality
- ✅ Password visibility toggle
- ✅ Loading states and error handling
- ✅ Component tests with Jest + React Testing Library

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Hashing**: bcrypt
- **Testing**: Jest + Supertest

### Frontend
- **Library**: React.js
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
melodyverse/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── tests/
│   │   └── auth.test.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── PasswordInput.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── ForgotPassword.js
    │   │   ├── ResetPassword.js
    │   │   └── Home.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── tests/
    │   │   └── Login.test.js
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css
    │   └── setupTests.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Compass)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/melodyverse_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

4. **Start MongoDB**
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`

5. **Run the backend**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test
```

Backend will run on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

4. **Run tests**
```bash
npm test
```

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/forgot-password` | Send reset link | No |
| POST | `/api/auth/reset-password` | Reset password | No |

### Request/Response Examples

**POST /api/auth/signup**
```json
// Request
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

// Response (201)
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**POST /api/auth/login**
```json
// Request
{
  "login": "john@example.com",  // Can be email or username
  "password": "password123"
}

// Response (200)
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

## 🔐 Authentication Flow

1. **Signup/Login** → User submits credentials
2. **Backend Validation** → Validates input, checks database
3. **Password Hashing** → Hashes password with bcrypt (signup only)
4. **JWT Generation** → Creates token with 24h expiration
5. **Token Storage** → Frontend stores in localStorage/sessionStorage
6. **Protected Routes** → Token sent in Authorization header
7. **Token Verification** → Backend middleware validates token

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Music Theme**: Purple/pink gradients with modern aesthetics
- **Animations**: Smooth transitions and micro-interactions
- **Form Validation**: Real-time feedback on user input
- **Error Handling**: Clear, user-friendly error messages
- **Loading States**: Visual feedback during async operations
- **Password Toggle**: Show/hide password functionality
- **Remember Me**: Persistent login across sessions

## ✅ Testing

### Backend Tests
```bash
cd backend
npm test
```
Tests include:
- User registration (success, duplicates, validation)
- User login (success, wrong password, non-existent user)
- Password reset flow
- Input validation
- Error handling

### Frontend Tests
```bash
cd frontend
npm test
```
Tests include:
- Component rendering
- Form validation
- User interactions
- API integration (mocked)
- Authentication flow
- Error states

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration (24 hours)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (using Mongoose)
- ✅ XSS protection
- ✅ CORS enabled
- ✅ Password reset token expiration (1 hour)
- ✅ Secure password requirements (min 6 characters)

## 📊 Database Schema

**User Collection:**
```javascript
{
  username: String (unique, required, 3-30 chars),
  email: String (unique, required, valid format),
  password: String (hashed, required, min 6 chars),
  resetPasswordToken: String (nullable),
  resetPasswordExpires: Date (nullable),
  createdAt: Date (default: now)
}
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
# In MongoDB Compass, connect to mongodb://localhost:27017
```

**Port Already in Use**
```bash
# Change PORT in .env or kill process
lsof -ti:5000 | xargs kill
```

### Frontend Issues

**Backend Connection Refused**
```bash
# Ensure backend is running on port 5000
cd backend
npm run dev
```

**Tailwind Styles Not Working**
```bash
# Rebuild with
npm start
```

## 📝 Assignment Requirements Checklist

### Backend ✅
- [x] Node.js + Express.js
- [x] MongoDB database
- [x] POST /signup endpoint
- [x] POST /login endpoint
- [x] JWT implementation
- [x] Password hashing (bcrypt)
- [x] Input validation
- [x] Error handling
- [x] Environment variables
- [x] Password reset functionality (bonus)
- [x] API tests (bonus)

### Frontend ✅
- [x] React.js with hooks
- [x] Login screen
- [x] Signup screen
- [x] Form validation
- [x] Error messages
- [x] Forgot password link
- [x] Remember me option
- [x] React Router navigation
- [x] Responsive design (Tailwind)
- [x] Password visibility toggle (bonus)
- [x] Animations (Framer Motion) (bonus)
- [x] Unit tests (bonus)
- [x] Password reset functionality (bonus)

## 🚀 Future Enhancements

- [ ] Email verification
- [ ] Rate limiting
- [ ] Refresh token mechanism
- [ ] OAuth integration (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Profile management
- [ ] Password strength meter
- [ ] Account deletion

## 📄 License

ISC

## 👨‍💻 Author

Created as part of Full Stack Developer Assignment

---

**Built with ❤️ using React.js, Node.js, and MongoDB**