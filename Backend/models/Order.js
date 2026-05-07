const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  specialInstructions: {
    type: String,
    default: '',
    trim: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true,
  },
  items: [orderItemSchema],
  tableNumber: {
    type: Number,
    required: [true, 'Table number is required'],
    min: [1, 'Table number must be at least 1'],
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  customerPhone: {
    type: String,
    default: '',
    trim: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Served', 'Completed'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

// Auto-increment order number
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { orderNumber: -1 } });
    this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1001;
  }
  next();
});

// Indexes
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
