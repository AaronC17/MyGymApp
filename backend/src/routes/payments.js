const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Membership = require('../models/Membership');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/payments - List payments
router.get('/', authenticate, async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const query = {};

    // Non-admin users can only see their own payments
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    } else if (userId) {
      query.userId = userId;
    }

    if (startDate || endDate) {
      query.paidAt = {};
      if (startDate) query.paidAt.$gte = new Date(startDate);
      if (endDate) query.paidAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .populate('membershipId')
      .sort({ paidAt: -1 });

    res.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/payments/:id - Get specific payment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('userId', 'name email')
      .populate('membershipId');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Users can only view their own payments unless they're admin
    if (req.user.role !== 'admin' && payment.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/payments - Create payment
router.post('/', authenticate, [
  body('userId').notEmpty(),
  body('membershipId').notEmpty(),
  body('amount').isNumeric().isFloat({ min: 0 }),
  body('paymentMethod').isIn(['cash', 'card', 'transfer']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, membershipId, amount, paymentMethod } = req.body;

    // Users can only create payments for themselves unless they're admin
    if (req.user.role !== 'admin' && userId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const payment = new Payment({
      userId,
      membershipId,
      amount,
      paymentMethod,
      status: 'completed',
    });

    await payment.save();

    // Update membership status to active
    await Membership.findByIdAndUpdate(membershipId, {
      status: 'active',
    });

    await payment.populate('userId', 'name email');
    await payment.populate('membershipId');

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/payments/stats - Get payment statistics (admin only)
router.get('/stats/summary', authenticate, requireAdmin, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarterly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'annual':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const payments = await Payment.find({
      status: 'completed',
      paidAt: { $gte: startDate },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const monthlyRevenue = payments
      .filter(p => {
        const paymentDate = new Date(p.paidAt);
        return paymentDate.getMonth() === now.getMonth() &&
               paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0);

    const paymentMethods = {};
    payments.forEach(p => {
      paymentMethods[p.paymentMethod] = (paymentMethods[p.paymentMethod] || 0) + 1;
    });

    res.json({
      totalRevenue,
      monthlyRevenue,
      paymentMethods,
      totalPayments: payments.length,
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

