const mongoose = require('mongoose');

const stockOutSchema = new mongoose.Schema({
  stockOutID: { type: String, required: true, unique: true },
  sparePartID: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
  stockOutQuantity: { type: Number, required: true },
  stockOutDate: { type: Date, default: Date.now },
  stockOutUnitPrice: { type: Number, required: true },
  stockOutTotalPrice: { type: Number },
  approvedBy: { type: String, required: true }
});

// Auto-calculate stockOutTotalPrice before save
stockOutSchema.pre('save', function(next) {
  this.stockOutTotalPrice = this.stockOutQuantity * this.stockOutUnitPrice;
  next();
});

module.exports = mongoose.model('StockOut', stockOutSchema); 