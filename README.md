# Yasa Graphics - Design Services Platform

A modern full-stack web application for showcasing design services, built with React, TypeScript, and Convex.

## 🚀 Features

- **Design Listings** - Browse and manage design services with pricing
- **Gallery** - Showcase portfolio items with images, videos, and links
- **Admin Dashboard** - Full CRUD operations for managing content
- **File Uploads** - Image and video uploads using Convex Storage
- **Real-time Updates** - Automatic data synchronization with Convex
- **Responsive Design** - Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Convex (Backend-as-a-Service)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A modern web browser

## 🚀 Quick Start

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
- Generate the API files
- Provide you with a `CONVEX_URL`

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CONVEX_URL=your_convex_url_here
```

The `CONVEX_URL` will be provided when you run `npx convex dev`.

### 4. Start Development Server

```bash
npm run dev
```

This will start both:
- Convex dev server (backend)
- Vite dev server (frontend) on `http://localhost:5173`

## 📁 Project Structure

```
YasaGraphicsV1/
├── convex/                 # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication
│   ├── designs.ts         # Design listings CRUD
│   ├── gallery.ts         # Gallery items CRUD
│   ├── files.ts           # File upload handling
│   └── utils.ts           # Helper functions
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🔐 Admin Access

**Admin Credentials:**
- Username: `yasagraphicsadmin`
- Password: `admin@@@@18007`

Access the admin dashboard at `/admin-login`

## 📦 Available Scripts

- `npm run dev` - Start development server (Convex + Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run convex:dev` - Start Convex dev server only
- `npm run convex:deploy` - Deploy Convex functions

## 🚢 Deployment

### Deploy to Vercel

1. **Deploy Convex Functions:**
   ```bash
   npx convex deploy
   ```

2. **Set Environment Variable in Vercel:**
   - Go to your Vercel project settings
   - Add environment variable: `VITE_CONVEX_URL`
   - Value: Your Convex deployment URL

3. **Deploy Frontend:**
   ```bash
   vercel deploy
   ```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📚 Documentation

- [Convex Setup Guide](./CONVEX_SETUP.md) - Detailed Convex setup instructions
- [Convex Documentation](https://docs.convex.dev/) - Official Convex docs

## 🎨 Features Overview

### Design Listings
- Create, read, update, and delete design services
- Support for images and videos
- Category-based organization
- Discount pricing support
- "Starting from" price tags

### Gallery
- Categorized portfolio showcase
- Image and video support
- External URL links
- Full-screen viewer

### Admin Dashboard
- Secure admin authentication
- Real-time data management
- File uploads with preview
- Content customization

## 🔧 Troubleshooting

**Convex functions not working?**
- Make sure `npx convex dev` is running
- Check that `VITE_CONVEX_URL` is set correctly
- Verify Convex functions are deployed

**File uploads failing?**
- Ensure you're logged in as admin
- Check Convex Storage is enabled
- Review browser console for errors

**Data not syncing?**
- Convex automatically syncs data
- Refresh the page if needed
- Check Convex dashboard for function logs

## 📝 License

Private project - All rights reserved

## 👥 Support

For issues or questions, check the Convex dashboard logs or review the [Convex Setup Guide](./CONVEX_SETUP.md).
