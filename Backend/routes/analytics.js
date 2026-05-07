const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/analytics/popular - Top 5 most ordered items
router.get('/popular', async (req, res) => {
  try {
    const items = await MenuItem.find({ orderCount: { $gt: 0 } })
      .sort({ orderCount: -1 })
      .limit(5)
      .select('name category price orderCount image isVeg');
    res.json(items);
  } catch (error) {
    console.error('Popular analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/revenue - Today's revenue summary
router.get('/revenue', authMiddleware, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({
      createdAt: { $gte: startOfDay },
      status: { $ne: 'Cancelled' },
    });

    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const completedOrders = todayOrders.filter(o => o.status === 'Completed').length;
    const pendingOrders = todayOrders.filter(o => o.status === 'Pending').length;
    const preparingOrders = todayOrders.filter(o => o.status === 'Preparing').length;
    const servedOrders = todayOrders.filter(o => o.status === 'Served').length;

    res.json({
      totalRevenue,
      totalOrders: todayOrders.length,
      completedOrders,
      pendingOrders,
      preparingOrders,
      servedOrders,
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/orders-count - Order count by status
router.get('/orders-count', authMiddleware, async (req, res) => {
  try {
    const counts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {};
    counts.forEach(c => {
      result[c._id] = c.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Order count analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/overview - Overall cafe statistics
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments({ status: { $ne: 'Cancelled' } });
    
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    const menuItemsCount = await MenuItem.countDocuments();
    
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    res.json({
      totalRevenue,
      totalOrders: totalOrdersCount,
      menuItems: menuItemsCount,
      avgOrderValue
    });
  } catch (error) {
    console.error('Overview analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/revenue-chart - Last 7 days revenue
router.get('/revenue-chart', authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyRevenue = await Order.aggregate([
      { $match: { 
          status: { $ne: 'Cancelled' },
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days with 0 revenue
    const chartData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const found = dailyRevenue.find(r => r._id === dateStr);
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      chartData.push({
        date: dateStr,
        day: dayName,
        revenue: found ? found.revenue : 0
      });
    }

    res.json(chartData);
  } catch (error) {
    console.error('Revenue chart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/category-breakdown - Revenue & orders per category
router.get('/category-breakdown', authMiddleware, async (req, res) => {
  try {
    const categoryData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemDetails'
        }
      },
      { $unwind: '$menuItemDetails' },
      {
        $group: {
          _id: '$menuItemDetails.category',
          orderCount: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json(categoryData);
  } catch (error) {
    console.error('Category breakdown error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/peak-hours - Orders count grouped by hour
router.get('/peak-hours', authMiddleware, async (req, res) => {
  try {
    const hourlyData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Initialize array with 24 hours (0-23)
    const formattedData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
      count: 0
    }));

    // Fill actual data
    hourlyData.forEach(item => {
      formattedData[item._id].count = item.count;
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Peak hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
