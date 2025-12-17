# Convex Setup Guide

This project has been migrated from Node.js/Express/MySQL backend to Convex.

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Convex

```bash
npx convex dev
```

This will:
- Create a Convex account (if you don't have one)
- Initialize your Convex project
- Generate the `_generated` API files
- Provide you with a `CONVEX_URL`

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CONVEX_URL=your_convex_url_here
```

The `CONVEX_URL` will be provided when you run `npx convex dev`.

### 4. Deploy Convex Functions

The Convex functions are already set up in the `convex/` directory:
- `schema.ts` - Database schema
- `auth.ts` - Authentication functions
- `designs.ts` - Design listings CRUD
- `gallery.ts` - Gallery items CRUD
- `files.ts` - File upload handling

When you run `npx convex dev`, these will be automatically deployed.

### 5. Start Development Server

```bash
npm run dev
```

This will start both Convex dev server and Vite dev server.

## Migration Notes

### What Changed

1. **Backend**: Migrated from Express/MySQL to Convex
2. **Database**: Now using Convex's database (no MySQL needed)
3. **File Storage**: Using Convex Storage instead of local file system
4. **API Calls**: Replaced fetch calls with Convex hooks (`useQuery`, `useMutation`)

### Frontend Changes

- All API calls now use Convex hooks
- File uploads use Convex Storage
- Real-time updates (Convex automatically syncs data)

### Admin Credentials

Admin credentials remain the same:
- Username: `yasagraphicsadmin`
- Password: `admin@@@@18007`

## Deploying to Vercel

### 1. Deploy Convex Functions

```bash
npx convex deploy
```

### 2. Set Environment Variable in Vercel

In your Vercel project settings, add:
- `VITE_CONVEX_URL` = your Convex deployment URL

### 3. Deploy Frontend

```bash
vercel deploy
```

## Database Schema

The Convex schema includes:
- `designs` - Design service listings
- `profiling` - Gallery items
- `users` - Admin users (for future expansion)

## File Structure

```
convex/
  ├── schema.ts          # Database schema
  ├── auth.ts            # Authentication
  ├── designs.ts         # Design listings
  ├── gallery.ts         # Gallery items
  ├── files.ts           # File uploads
  └── _generated/        # Auto-generated (don't edit)
```

## Troubleshooting

**Convex functions not working?**
- Make sure `npx convex dev` is running
- Check that `VITE_CONVEX_URL` is set correctly
- Verify Convex functions are deployed (`npx convex deploy`)

**File uploads failing?**
- Check that you're logged in as admin
- Verify Convex Storage is enabled in your Convex project
- Check browser console for errors

**Data not syncing?**
- Convex automatically syncs, but you may need to refresh
- Check Convex dashboard for function logs

