# CCCS Online Payment System

A modern online payment system for Cordova Catholic Cooperative School built with React, Node.js, Express, and MySQL (hosted on Railway).

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MySQL2 (Railway MySQL Database)
- Bcryptjs (Password hashing)
- CORS, Helmet, Morgan

## Database Schema

### Accounts Table
Your current `accounts` table structure:

```sql
- id: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
- First_name: VARCHAR(255)
- Last_name: VARCHAR(255)
- LRN: INT (Learner Reference Number)
- Grade_level: INT
- Section: VARCHAR(255)
- Email: VARCHAR(255)
- Password: VARCHAR(255) - hashed with bcryptjs
```

**Important Notes:**
-  Passwords are automatically hashed using bcrypt before storage
-  Email and LRN should have UNIQUE constraints
-  Never store plain text passwords

### Payments Table
Created automatically via schema.sql

## Setup Instructions

### 1. Database Setup (Railway MySQL)

1. Import the schema located at `database/schema.sql` into your Railway MySQL database
2. This will create both `accounts` and `payments` tables

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration (Railway)
DB_HOST=your-railway-mysql-host.railway.app
DB_USER=root
DB_PASSWORD=your-database-password
DB_NAME=railway
DB_PORT=3306

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Get your Railway credentials:**
- Go to your Railway project
- Click on your MySQL database
- Copy the connection details (Host, User, Password, Database)

Start the server:
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

The server will run on `http://localhost:5000`

### 3. Client Setup

```bash
cd client
npm install
```

Start the client:
```bash
npm start
```

The app will open at `http://localhost:3000`
