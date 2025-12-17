# Database Setup for Design Listings

## Setup Instructions

### Step 1: Create the Database Table

Open **phpMyAdmin** (XAMPP) and execute this SQL query:

```sql
CREATE TABLE IF NOT EXISTS design_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  image LONGTEXT,
  video LONGTEXT,
  starting BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Or use the schema file: `Backend/db/schema.sql`

### Step 2: Verify Backend Configuration

Check that your `.env` file is correct:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=yasagraphicsdb
DB_PORT=3306
JWT_SECRET=your_secret_key_here
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Step 3: Start the Backend Server

```bash
cd Backend
npm start
```

You should see:
```
Database pool created successfully
Server is running on http://localhost:5000
```

### Step 4: Test the API Endpoints

- **GET** `/api/listings` - Get all design listings
- **POST** `/api/listings` - Create new listing (admin only, requires JWT token)
- **PUT** `/api/listings/:id` - Update listing (admin only)
- **DELETE** `/api/listings/:id` - Delete listing (admin only)

### Step 5: Start the Frontend

```bash
npm run dev
```

## Data Flow

1. **Admin Dashboard**:
   - Loads listings from API on mount
   - Creates/Updates/Deletes send requests to `/api/listings`
   - Toast notifications for success/error

2. **Design Page**:
   - Fetches listings from `/api/listings`
   - Combines with default DESIGN_ITEMS
   - Falls back to localStorage if API fails

## Features

✅ All design listings stored in MySQL database  
✅ Persistent data across sessions  
✅ Full CRUD operations (Create, Read, Update, Delete)  
✅ JWT authentication for admin operations  
✅ Fallback to localStorage if API unavailable  
✅ Support for images and videos (stored as base64)  
✅ Optional "Starting" price tag toggle  

## Troubleshooting

**Listings not showing after adding:**
- Check backend server is running
- Verify database table was created
- Check browser console for API errors

**"Failed to load listings" error:**
- Ensure MySQL is running (XAMPP)
- Verify database connection in `.env`
- Check server logs for database errors

**Videos not saving:**
- Video files are stored as base64 in database
- Remove video size limit was already removed
- Ensure database `video` column is LONGTEXT type
