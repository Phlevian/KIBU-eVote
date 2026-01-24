# KIBU-eVote Backend API 🔐

*RESTful API for KIBU Voting System*

A Node.js/Express backend API with MongoDB for the KIBU-eVote voting platform. This backend handles authentication, election management, voting logic, and results processing.

---

## 🎯 Overview

This is the backend service for the KIBU-eVote system. It provides secure APIs for student authentication, election management, vote casting, and results retrieval. Built with separation of concerns and RESTful principles.

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Environment**: dotenv

---

## 🏗 Project Structure

```
KIBU-eVote-Backend/
│
├── server.js                   # Application entry point
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (not committed)
├── .gitignore                  # Git ignore rules
│
├── config/
│   ├── database.js             # MongoDB connection setup
│   └── constants.js            # Application constants
│
├── models/
│   ├── Student.js              # Student/User model
│   ├── Election.js             # Election model
│   ├── Candidate.js            # Candidate model
│   ├── Vote.js                 # Vote model
│   └── Position.js             # Position model
│
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── studentController.js    # Student management
│   ├── electionController.js   # Election management
│   ├── candidateController.js  # Candidate management
│   ├── voteController.js       # Voting logic
│   └── resultsController.js    # Results and statistics
│
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   ├── studentRoutes.js        # Student endpoints
│   ├── electionRoutes.js       # Election endpoints
│   ├── candidateRoutes.js      # Candidate endpoints
│   ├── voteRoutes.js           # Voting endpoints
│   └── resultsRoutes.js        # Results endpoints
│
├── middleware/
│   ├── authMiddleware.js       # JWT verification
│   ├── validationMiddleware.js # Input validation
│   ├── errorMiddleware.js      # Error handling
│   └── roleMiddleware.js       # Role-based access control
│
├── utils/
│   ├── tokenUtils.js           # JWT helper functions
│   ├── responseUtils.js        # Standard API responses
│   ├── dateUtils.js            # Date/time helpers
│   └── validators.js           # Custom validators
│
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/KIBU-eVote-Backend.git
cd KIBU-eVote-Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (edit .env file)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kibu-evote
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kibu-evote

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Application
STUDENT_ID_PREFIX=KIBU
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be running at `http://localhost:5000`

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 🛣 API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new student | No |
| POST | `/login` | Student login | No |
| POST | `/logout` | Logout student | Yes |
| GET | `/me` | Get current user | Yes |
| PUT | `/update-password` | Change password | Yes |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password/:token` | Reset password | No |

### Student Routes (`/api/students`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get student profile | Yes |
| PUT | `/profile` | Update profile | Yes |
| GET | `/voting-history` | Get voting history | Yes |
| GET | `/verify/:studentId` | Verify student ID | Admin |

### Election Routes (`/api/elections`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all elections | Yes |
| GET | `/active` | Get active elections | Yes |
| GET | `/upcoming` | Get upcoming elections | Yes |
| GET | `/completed` | Get completed elections | Yes |
| GET | `/:id` | Get election by ID | Yes |
| POST | `/` | Create election | Admin |
| PUT | `/:id` | Update election | Admin |
| DELETE | `/:id` | Delete election | Admin |

### Candidate Routes (`/api/candidates`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/election/:electionId` | Get candidates by election | Yes |
| GET | `/position/:positionId` | Get candidates by position | Yes |
| GET | `/:id` | Get candidate by ID | Yes |
| POST | `/` | Add candidate | Admin |
| PUT | `/:id` | Update candidate | Admin |
| DELETE | `/:id` | Delete candidate | Admin |

### Vote Routes (`/api/votes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/cast` | Cast vote | Yes |
| GET | `/verify/:voteId` | Verify vote receipt | Yes |
| GET | `/status/:electionId` | Check if voted | Yes |
| GET | `/receipt/:electionId` | Get vote receipt | Yes |

### Results Routes (`/api/results`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/election/:electionId` | Get election results | Yes |
| GET | `/position/:positionId` | Get position results | Yes |
| GET | `/statistics/:electionId` | Get election statistics | Yes |
| GET | `/export/:electionId` | Export results (CSV/PDF) | Admin |

---

## 📊 Database Models

### Student Model
```javascript
{
  studentId: String,        // KIBU/ICT/001/2024
  firstName: String,
  lastName: String,
  email: String,
  password: String,         // Hashed
  faculty: String,
  department: String,
  yearOfStudy: Number,
  profilePhoto: String,
  isVerified: Boolean,
  role: String,             // student, admin
  createdAt: Date,
  updatedAt: Date
}
```

### Election Model
```javascript
{
  title: String,
  description: String,
  type: String,             // student-council, sports, clubs
  startDate: Date,
  endDate: Date,
  status: String,           // upcoming, active, completed
  positions: [ObjectId],    // Reference to Position
  eligibleVoters: {
    faculties: [String],
    yearOfStudy: [Number]
  },
  totalVoters: Number,
  totalVotes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Position Model
```javascript
{
  electionId: ObjectId,     // Reference to Election
  title: String,            // President, Vice President, etc.
  description: String,
  maxCandidates: Number,
  order: Number,            // Display order
  createdAt: Date
}
```

### Candidate Model
```javascript
{
  studentId: ObjectId,      // Reference to Student
  electionId: ObjectId,     // Reference to Election
  positionId: ObjectId,     // Reference to Position
  manifesto: String,
  photo: String,
  votes: Number,
  status: String,           // pending, approved, rejected
  createdAt: Date
}
```

### Vote Model
```javascript
{
  studentId: ObjectId,      // Reference to Student
  electionId: ObjectId,     // Reference to Election
  votes: [{
    positionId: ObjectId,
    candidateId: ObjectId
  }],
  voteHash: String,         // For verification (blockchain later)
  timestamp: Date,
  ipAddress: String,
  verified: Boolean
}
```

---

## 🔐 Authentication & Security

### JWT Authentication
- Tokens issued on login
- 7-day expiration (configurable)
- Stored in HTTP-only cookies (recommended) or localStorage
- Required for protected routes

### Password Security
- Hashed with bcrypt (10 rounds)
- Minimum 8 characters required
- Never stored in plain text

### Middleware Protection
```javascript
// Protect routes
router.get('/profile', authMiddleware, getProfile);

// Admin only routes
router.post('/elections', authMiddleware, adminOnly, createElection);
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register a student
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "KIBU/ICT/001/2024",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@kibu.ac.ke",
    "password": "SecurePass123",
    "faculty": "Science",
    "department": "Computer Science",
    "yearOfStudy": 3
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "KIBU/ICT/001/2024",
    "password": "SecurePass123"
  }'

# Get active elections (requires token)
curl -X GET http://localhost:5000/api/elections/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import the API endpoints
2. Set environment variable for `baseUrl`: `http://localhost:5000`
3. Set `token` variable after login
4. Use `{{baseUrl}}` and `{{token}}` in requests

---

## 📝 Standard API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev mode only)"
}
```

---

## 🔄 Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/vote-api
```

2. **Make changes** (models, controllers, routes)

3. **Test locally**
```bash
npm run dev
```

4. **Commit and push**
```bash
git add .
git commit -m "Add vote casting API"
git push origin feature/vote-api
```

---

## 📋 To-Do List

- [x] Project structure setup
- [ ] Database configuration
- [ ] Student model and auth
- [ ] Election CRUD operations
- [ ] Candidate management
- [ ] Vote casting logic
- [ ] Results calculation
- [ ] Input validation
- [ ] Error handling
- [ ] API documentation
- [ ] Unit tests
- [ ] Integration tests
- [ ] Rate limiting
- [ ] File upload (photos)
- [ ] Email notifications
- [ ] Blockchain integration (future)

---

## 🤝 Contributing

1. Follow the project structure
2. Use meaningful commit messages
3. Write clean, commented code
4. Test before pushing
5. Update documentation

---

## 👥 Team

**KIBU Computer Science Students**
- Backend Developer: [Phlevian]
- Frontend Developer: [Friend's Name]

---

## 📄 License

Educational project for KIBU coursework.

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Start MongoDB service
sudo service mongod start
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### JWT Token Issues
- Check JWT_SECRET is set in .env
- Verify token format: `Bearer <token>`
- Check token expiration

---

*Built with ❤ for KIBU Students*