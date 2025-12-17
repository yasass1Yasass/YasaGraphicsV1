import express from 'express';
import { executeQuery } from '../db/connection.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload file endpoint
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Create design listing (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, category, price, image, video, starting, discountEnabled, discountPercentage } = req.body;

    if (!title || !subtitle || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!image && !video) {
      return res.status(400).json({ error: 'At least image or video is required' });
    }

    // Validate that image and video are strings (file paths), not large binary/base64 data
    if (image && typeof image === 'string' && image.length > 500) {
      return res.status(400).json({ error: 'Image data too large. Please upload files separately and provide file paths only.' });
    }

    if (video && typeof video === 'string' && video.length > 500) {
      return res.status(400).json({ error: 'Video data too large. Please upload files separately and provide file paths only.' });
    }

    const id = Date.now().toString();
    
    try {
      // Try with discount columns first
      const query = `
        INSERT INTO designs (id, title, description, category, price_lkr, image, video, badge, discount_enabled, discount_percentage, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      await executeQuery(query, [
        id,
        title,
        subtitle,
        category,
        price,
        image || null,
        video || null,
        starting ? 'starting' : null,
        discountEnabled ? 1 : 0,
        discountEnabled && discountPercentage ? Math.min(100, Math.max(0, discountPercentage)) : 0
      ]);
    } catch (discountError) {
      // If discount columns don't exist, try without them
      if (discountError.code === 'ER_BAD_FIELD_ERROR') {
        const fallbackQuery = `
          INSERT INTO designs (id, title, description, category, price_lkr, image, video, badge, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        await executeQuery(fallbackQuery, [
          id,
          title,
          subtitle,
          category,
          price,
          image || null,
          video || null,
          starting ? 'starting' : null
        ]);
      } else {
        throw discountError;
      }
    }

    res.json({
      id,
      title,
      subtitle,
      category,
      price,
      image: image || '',
      video,
      starting,
      discountEnabled: discountEnabled || false,
      discountPercentage: (discountEnabled && discountPercentage) ? discountPercentage : 0,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get all design listings
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM designs ORDER BY created_at DESC';
    const results = await executeQuery(query);

    const listings = results.map(row => ({
      id: row.id.toString(),
      title: row.title,
      subtitle: row.description || '',
      category: row.category,
      price: row.price_lkr,
      image: row.image || '',
      video: row.video,
      starting: row.badge === 'starting',
      discountEnabled: row.discount_enabled ? Boolean(row.discount_enabled) : false,
      discountPercentage: row.discount_percentage || 0,
      createdAt: new Date(row.created_at).getTime()
    }));

    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Update design listing (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, category, price, image, video, starting, discountEnabled, discountPercentage } = req.body;

    if (!title || !subtitle || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!image && !video) {
      return res.status(400).json({ error: 'At least image or video is required' });
    }

    try {
      // Try with discount columns first
      const query = `
        UPDATE designs
        SET title = ?, description = ?, category = ?, price_lkr = ?, image = ?, video = ?, badge = ?, discount_enabled = ?, discount_percentage = ?
        WHERE id = ?
      `;

      await executeQuery(query, [
        title,
        subtitle,
        category,
        price,
        image || null,
        video || null,
        starting ? 'starting' : null,
        discountEnabled ? 1 : 0,
        discountEnabled && discountPercentage ? Math.min(100, Math.max(0, discountPercentage)) : 0,
        id
      ]);
    } catch (discountError) {
      // If discount columns don't exist, try without them
      if (discountError.code === 'ER_BAD_FIELD_ERROR') {
        const fallbackQuery = `
          UPDATE designs
          SET title = ?, description = ?, category = ?, price_lkr = ?, image = ?, video = ?, badge = ?
          WHERE id = ?
        `;
        
        await executeQuery(fallbackQuery, [
          title,
          subtitle,
          category,
          price,
          image || null,
          video || null,
          starting ? 'starting' : null,
          id
        ]);
      } else {
        throw discountError;
      }
    }

    res.json({
      id,
      title,
      subtitle,
      category,
      price,
      image: image || '',
      video,
      starting,
      discountEnabled: discountEnabled || false,
      discountPercentage: (discountEnabled && discountPercentage) ? discountPercentage : 0
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete design listing (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM designs WHERE id = ?';
    await executeQuery(query, [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// ===== GALLERY ENDPOINTS =====

// Create gallery item
router.post('/gallery/add', authenticateToken, async (req, res) => {
  try {
    const { category, title, description, image_url, video_url, url } = req.body;

    console.log('Gallery add request:', { category, title, description, image_url, video_url, url });

    if (!category || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields: category, title, description' });
    }

    // Allow at least one of: image, video, or url
    if (!image_url && !video_url && !url) {
      return res.status(400).json({ error: 'At least one of image, video, or URL is required' });
    }

    const id = Date.now().toString();
    const query = `
      INSERT INTO Profiling (id, category, title, description, image_url, video_url, url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const params = [
      id,
      category,
      title,
      description,
      image_url || null,
      video_url || null,
      url || null
    ];

    console.log('Executing query with params:', params);

    await executeQuery(query, params);

    console.log('Gallery item created successfully:', id);

    res.json({
      id,
      category,
      title,
      description,
      image_url: image_url || '',
      video_url: video_url || '',
      url: url || '',
      createdAt: Date.now()
    });
  } catch (error) {
    console.error('Create gallery item error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to create gallery item: ' + error.message });
  }
});

// Get all gallery items
router.get('/gallery/all', async (req, res) => {
  try {
    const query = 'SELECT * FROM Profiling ORDER BY created_at DESC';
    const results = await executeQuery(query);

    const items = results.map(row => ({
      id: row.id.toString(),
      category: row.category,
      title: row.title,
      description: row.description || '',
      image_url: row.image_url || '',
      video_url: row.video_url || '',
      url: row.url || '',
      createdAt: new Date(row.created_at).getTime()
    }));

    res.json(items);
  } catch (error) {
    console.error('Get gallery items error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// Delete gallery item
router.delete('/gallery/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM Profiling WHERE id = ?';
    await executeQuery(query, [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

export default router;
