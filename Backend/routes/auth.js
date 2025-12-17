import express from 'express';
import { generateToken } from '../middleware/auth.js';
import bcryptjs from 'bcryptjs';

const router = express.Router();

// Admin credentials (hardcoded for now, can be moved to database later)
const ADMIN_USERNAME = 'yasagraphicsadmin';
const ADMIN_PASSWORD = 'admin@@@@18007';

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate token
      const token = generateToken({
        id: 'admin',
        username: ADMIN_USERNAME,
        role: 'admin'
      });

      return res.json({
        success: true,
        token,
        admin: {
          username: ADMIN_USERNAME,
          role: 'admin'
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify Token
router.post('/verify', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Token verification happens in middleware, if we reach here token is valid
    res.json({ success: true, message: 'Token is valid' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout (client-side token deletion, but we can invalidate on backend)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
