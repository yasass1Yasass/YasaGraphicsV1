# Yasa Graphics Backend

Node.js/Express backend for Yasa Graphics website.

## Project Structure

```
Backend/
├── server.js              # Main server entry point
├── config.js              # Configuration file
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
├── routes/               # API routes
├── controllers/          # Route controllers
├── middleware/           # Custom middleware
└── db/                   # Database utilities
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file with your configuration:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yasagraphics
DB_PORT=3306
JWT_SECRET=your_secret_key_here
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if backend is running

## Features

- ✅ Express.js server
- ✅ CORS enabled
- ✅ JWT authentication middleware
- ✅ MySQL database support
- ✅ bcryptjs for password hashing
- ✅ Environment variable configuration
- ✅ Error handling

## Next Steps

1. Set up MySQL database
2. Create database models in `db/`
3. Add API routes in `routes/`
4. Implement controllers in `controllers/`
5. Connect frontend to backend API
