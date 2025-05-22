const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
  sparePartID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number }
});

// Auto-calculate totalPrice before save
sparePartSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('SparePart', sparePartSchema); 