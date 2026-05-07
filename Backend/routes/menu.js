const express = require('express');
const multer = require('multer');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Configure multer for memory storage (max 2MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/menu - Get all menu items (public)
router.get('/', async (req, res) => {
  try {
    const { category, inStock } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/menu/popular - Get top 5 most ordered (public)
router.get('/popular', async (req, res) => {
  try {
    const items = await MenuItem.find({ inStock: true, orderCount: { $gt: 0 } })
      .sort({ orderCount: -1 })
      .limit(5);
    res.json(items);
  } catch (error) {
    console.error('Get popular error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/menu - Add new menu item (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Add menu item error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/menu/:id - Update menu item (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Update menu item error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/menu/:id - Delete menu item (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/menu/:id/stock - Toggle stock status (admin only)
router.patch('/:id/stock', authMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    item.inStock = !item.inStock;
    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Toggle stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/menu/upload-image - Upload image as base64 (admin only)
router.post('/upload-image', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    const b64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageUrl = `data:${mimeType};base64,${b64}`;
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;
