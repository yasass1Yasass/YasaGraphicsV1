# EcoVenture - Eco-Tourism Platform

A full-stack web application for eco-tourism management built with React, TypeScript, Node.js, and MySQL.

## 🚀 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [XAMPP](https://www.apachefriends.org/) (for MySQL database)
- A modern web browser

## 📁 Project Structure

```
Ecoventure/
├── TASK-1/                    # Frontend (React + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── TASK-2 backend/            # Backend (Node.js + Express)
    ├── server.js
    ├── package.json
    ├── uploads/
    └── ...
```

## 🗄️ Database Setup with XAMPP

### 1. Install and Start XAMPP

1. Download and install [XAMPP](https://www.apachefriends.org/)
2. Open XAMPP Control Panel
3. Start **Apache** and **MySQL** services

### 2. Create Database

1. Open your web browser and go to `http://localhost/phpmyadmin`
2. Click on "New" to create a new database
3. Name the database: `ecoventure`
4. Click "Create"

### 3. Create Required Tables

Execute the following SQL commands in phpMyAdmin:

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tours table
CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255),
    duration VARCHAR(100),
    image VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Rentals table
CREATE TABLE rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255),
    category VARCHAR(100),
    image VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    tour_id INT,
    booking_date DATE,
    participants INT,
    total_price DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```powershell
cd "TASK -2 backend"
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory with the following content:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecoventure
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 4. Start the Backend Server

```powershell
node server.js
```

The backend server will start on `http://localhost:5000`

**Backend API Endpoints:**
- `GET /api/tours` - Get all tours
- `POST /api/tours` - Create new tour (admin)
- `GET /api/rentals` - Get all rentals
- `POST /api/rentals` - Create new rental
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/bookings` - Create booking

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```powershell
cd ..
# You should now be in the TASK-1 directory
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Start the Development Server

```powershell
npm run dev
```

The frontend application will start on `http://localhost:5173`

## 🧪 Testing the Application

### Testing the API (Backend)

You can test the API endpoints using tools like:

1. **Postman** or **Insomnia**
2. **curl** commands
3. **Browser** (for GET requests)

#### Example API Tests:

**1. Register a new user:**
```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**2. Login:**
```powershell
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**3. Get all tours:**
```powershell
curl http://localhost:5000/api/tours
```

### Testing the GUI (Frontend)

1. Open your browser and go to `http://localhost:5173`
2. Test the following features:
   - **User Registration** - Navigate to `/signup`
   - **User Login** - Navigate to `/login`
   - **Browse Tours** - Navigate to `/tours`
   - **Browse Rentals** - Navigate to `/rentals`
   - **Admin Panel** - Login as admin and navigate to `/admin`
   - **Create Tours** - Admin functionality
   - **Booking System** - Book a tour

### Admin Account Setup

To test admin features, create an admin user by directly inserting into the database:

```sql
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@ecoventure.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
```

**Admin Credentials:**
- Email: `admin@ecoventure.com`
- Password: `password`

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 📝 Build for Production

### Frontend Build
```powershell
npm run build
```

### Backend Production
```powershell
# In the backend directory
npm start
```

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Ensure XAMPP MySQL service is running
   - Check database credentials in `.env` file
   - Verify database name exists

2. **Port Already in Use:**
   - Change port in backend `.env` file
   - Kill existing processes using the port

3. **CORS Issues:**
   - Backend has CORS enabled for all origins
   - Ensure frontend and backend are on different ports

4. **File Upload Issues:**
   - Check if `uploads` directory exists in backend
   - Verify write permissions

## 📧 Support

For any issues or questions, please check the console logs in both frontend and backend terminals for detailed error messages.
