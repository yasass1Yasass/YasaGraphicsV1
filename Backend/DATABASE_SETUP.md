# Database Setup Instructions

## Step 1: Add Missing Columns to Existing `designs` Table

Open phpMyAdmin and run this SQL to add the image and video columns to your existing designs table:

```sql
ALTER TABLE designs ADD COLUMN image LONGTEXT AFTER price_lkr;
ALTER TABLE designs ADD COLUMN video LONGTEXT AFTER image;
```

## Step 2: Update Table Structure (Optional - if you want to ensure badge column exists)

If badge column doesn't exist, add it:
```sql
ALTER TABLE designs ADD COLUMN badge VARCHAR(100) DEFAULT NULL AFTER price_lkr;
```

## Step 3: Verify Table Structure

Your `designs` table should now have these columns:
- `id` (varchar) - Primary Key
- `title` (varchar)
- `description` (text) - Used for subtitle
- `category` (varchar)
- `price_lkr` (int)
- `image` (LONGTEXT) - NEW - stores base64 image
- `video` (LONGTEXT) - NEW - stores base64 video
- `badge` (varchar) - Used to store "starting" tag
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Step 4: How Data Maps

- **title** → Title
- **description** → Subtitle
- **category** → Category
- **price_lkr** → Price (in LKR)
- **image** → Base64 encoded image
- **video** → Base64 encoded video
- **badge** → Set to "starting" if "Starting" tag is enabled, NULL otherwise
- **created_at** → Created timestamp
- **updated_at** → Updated timestamp

## Step 5: Start the Backend

```bash
cd Backend
npm start
```

The API will now:
- Create listings in the `designs` table
- Update existing listings
- Delete listings
- Fetch all listings from your existing table

## Done! 🎉

All design listings will now be saved in your existing `yasagraphicsdb.designs` table in XAMPP.
