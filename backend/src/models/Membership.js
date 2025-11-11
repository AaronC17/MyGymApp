const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  planType: {
    type: String,
    enum: ['monthly', 'quarterly', 'annual', 'premium'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'expired'],
    default: 'active',
  },
  price: {
    type: Number,
    required: true,
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
membershipSchema.index({ userId: 1, status: 1 });
membershipSchema.index({ endDate: 1 });

// Method to check if membership is expired
membershipSchema.methods.isExpired = function () {
  return new Date() > this.endDate;
};

// Method to check if membership is expiring soon
membershipSchema.methods.isExpiringSoon = function (days = 7) {
  const expirationDate = new Date(this.endDate);
  const daysUntilExpiration = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiration <= days && daysUntilExpiration > 0;
};

module.exports = mongoose.model('Membership', membershipSchema);

