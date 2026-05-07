const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/orders - Place a new order (public - customer)
router.post('/', async (req, res) => {
  try {
    const { items, tableNumber, customerName, customerPhone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!tableNumber || !customerName) {
      return res.status(400).json({ message: 'Table number and customer name are required' });
    }

    // Validate items and check stock
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItemId}` });
      }
      if (!menuItem.inStock) {
        return res.status(400).json({ message: `${menuItem.name} is currently out of stock` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || '',
      });
    }

    const order = new Order({
      items: orderItems,
      tableNumber,
      customerName,
      customerPhone: customerPhone || '',
      totalPrice,
    });

    await order.save();

    // Increment order counts on menu items
    for (const item of items) {
      await MenuItem.findByIdAndUpdate(item.menuItemId, {
        $inc: { orderCount: item.quantity },
      });
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      const populatedOrder = await Order.findById(order._id).populate('items.menuItem');
      io.to('admin').emit('new-order', populatedOrder);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders - Get all orders (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('items.menuItem');

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/today - Get today's orders (admin only)
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({ createdAt: { $gte: startOfDay } })
      .sort({ createdAt: -1 })
      .populate('items.menuItem');

    res.json(orders);
  } catch (error) {
    console.error('Get today orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:id - Get single order (public - for order tracking)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/orders/:id/status - Update order status (admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Served', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('order-status-update', order);
      io.to(`order-${order._id}`).emit('order-status-update', order);
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:id/bill - Generate bill data + WhatsApp link
router.get('/:id/bill', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Build bill text
    let billText = `🧾 *TableTalk - Bill*\n`;
    billText += `Table: ${order.tableNumber} | Order #${order.orderNumber}\n`;
    billText += `Customer: ${order.customerName}\n`;
    billText += `─────────────────\n`;

    order.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      billText += `${item.quantity}x ${item.name}    ₹${itemTotal}\n`;
      if (item.specialInstructions) {
        billText += `   📝 ${item.specialInstructions}\n`;
      }
    });

    billText += `─────────────────\n`;
    billText += `*Total: ₹${order.totalPrice}*\n`;
    billText += `\nThank you for dining with us! ☕`;

    // Generate WhatsApp link
    const phone = order.customerPhone.replace(/[^0-9]/g, '');
    const encodedBill = encodeURIComponent(billText);
    const whatsappLink = phone
      ? `https://wa.me/${phone}?text=${encodedBill}`
      : null;

    res.json({
      order,
      billText,
      whatsappLink,
    });
  } catch (error) {
    console.error('Generate bill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
