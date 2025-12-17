# Database Setup Guide for Yasa Graphics

## Quick Setup (3 Steps)

### Step 1: Open phpMyAdmin
1. Open XAMPP Control Panel
2. Start Apache and MySQL
3. Go to `http://localhost/phpmyadmin`
4. Make sure you're viewing the `yasagraphicsdb` database

### Step 2: Copy & Paste SQL Script
1. In phpMyAdmin, click the **SQL** tab
2. Copy all the code from `setup_database.sql` (in the project root)
3. Paste it into the SQL editor
4. Click **Go** to execute

**Or import the file directly:**
- Click **Import**
- Choose `setup_database.sql` file
- Click **Go**

### Step 3: Verify Tables Were Created
In phpMyAdmin, you should see these tables:
- ✅ `designs` - Design listings
- ✅ `users` - Admin users (for future use)
- ✅ `gallery_items` - Gallery items with images/videos
- ✅ `portfolio_items` - Portfolio showcase
- ✅ `navbar_settings` - Navbar configuration

---

## What Each Table Does

### 1. `designs` Table
Stores all design service listings from the Admin Dashboard

**Columns:**
- `id` - Unique identifier
- `title` - Design title
- `description` - Subtitle/description
- `category` - Design category
- `price_lkr` - Price in LKR
- `image` - Image file path (e.g., `/uploads/abc123.jpg`)
- `video` - Video file path (e.g., `/uploads/video123.mp4`)
- `badge` - Shows "starting" tag if set
- `created_at` - Created timestamp
- `updated_at` - Last updated timestamp

### 2. `gallery_items` Table
Stores gallery items with categories, images, videos, and URLs

**Columns:**
- `id` - Unique identifier
- `category` - Gallery category
- `subtitle` - Item subtitle
- `image` - Image file path
- `video` - Video file path (optional)
- `url` - External URL/link
- `created_at` - Created timestamp
- `updated_at` - Last updated timestamp

### 3. Other Tables
- `users` - For storing admin credentials (currently hardcoded)
- `portfolio_items` - For portfolio showcase items
- `navbar_settings` - For navbar text and display settings

---

## Current Data Storage

### How Data Flows:
1. **Admin Dashboard** → Form inputs
2. **Frontend** → File upload to `/api/listings/upload`
3. **Backend** → Saves files to `public/uploads/`
4. **Database** → Stores file path (e.g., `/uploads/file123.jpg`)
5. **Frontend Display** → Loads image from `http://localhost:5000/uploads/file123.jpg`

### Important:
- **Old listings** still have base64 data in the `image` column (before changes)
- **New listings** have file paths that point to uploaded files
- The app handles **both automatically**

---

## Troubleshooting

### Issue: Tables already exist
**Solution:** The SQL script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run again. It won't overwrite existing data.

### Issue: Connection refused
**Solution:** Make sure:
- MySQL is running in XAMPP
- `.env` file has correct credentials:
  - `DB_HOST=localhost`
  - `DB_USER=root`
  - `DB_PASSWORD=` (empty)
  - `DB_NAME=yasagraphicsdb`

### Issue: Permission denied
**Solution:** In phpMyAdmin, make sure you're logged in with root user (default has no password).

---

## What's New?

✅ File upload endpoint for images and videos
✅ Gallery items can have image + video + URL (all optional, at least one required)
✅ Proper database schema for all features
✅ File storage in `public/uploads/`
✅ Static file serving from backend

---

## Next Steps

1. ✅ Run the SQL setup script
2. ✅ Verify tables in phpMyAdmin
3. ✅ Start the backend server (`npm run dev` in Backend folder)
4. ✅ Start the frontend server (`npm run dev` in root folder)
5. ✅ Test by creating new listings/gallery items

All data will now be saved to your XAMPP MySQL database!
