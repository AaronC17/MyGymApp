const express = require('express');
const User = require('../models/User');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Active clients
    const activeClients = await User.countDocuments({ role: 'client' });

    // Active memberships
    const activeMemberships = await Membership.countDocuments({ status: 'active' });

    // Total revenue (all time)
    const allPayments = await Payment.find({ status: 'completed' });
    const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);

    // Monthly revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPayments = await Payment.find({
      status: 'completed',
      paidAt: { $gte: startOfMonth },
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    // Expiring memberships (next 7 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const expiringMemberships = await Membership.countDocuments({
      status: 'active',
      endDate: { $lte: expirationDate, $gte: new Date() },
    });

    // Product sales (active products)
    const productSales = await Product.countDocuments({ isActive: true });

    // Calculate monthly growth
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthPayments = await Payment.find({
      status: 'completed',
      paidAt: { $gte: lastMonth, $lte: lastMonthEnd },
    });
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const monthlyGrowth = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    res.json({
      activeClients,
      activeMemberships,
      totalRevenue,
      monthlyRevenue,
      expiringMemberships,
      productSales,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/revenue - Revenue by period
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;

    let query = { status: 'completed' };

    if (startDate && endDate) {
      query.paidAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to last 12 months
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      query.paidAt = { $gte: start };
    }

    const payments = await Payment.find(query).sort({ paidAt: 1 });

    // Group by period
    const revenueByPeriod = {};
    payments.forEach(payment => {
      const date = new Date(payment.paidAt);
      let key;

      if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (period === 'quarterly') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
      } else {
        key = String(date.getFullYear());
      }

      if (!revenueByPeriod[key]) {
        revenueByPeriod[key] = 0;
      }
      revenueByPeriod[key] += payment.amount;
    });

    const revenue = Object.entries(revenueByPeriod).map(([period, amount]) => ({
      period,
      amount: Math.round(amount * 100) / 100,
    }));

    res.json({ revenue });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/memberships-stats - Membership statistics
router.get('/memberships-stats', async (req, res) => {
  try {
    const total = await Membership.countDocuments();
    const active = await Membership.countDocuments({ status: 'active' });
    const suspended = await Membership.countDocuments({ status: 'suspended' });
    const expired = await Membership.countDocuments({ status: 'expired' });

    const byPlanType = await Membership.aggregate([
      {
        $group: {
          _id: '$planType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      active,
      suspended,
      expired,
      byPlanType: byPlanType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Get memberships stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

