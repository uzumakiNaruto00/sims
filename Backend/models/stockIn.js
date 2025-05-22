const mongoose = require('mongoose');

const stockInSchema = new mongoose.Schema({
  stockInID: { type: String, required: true, unique: true },
  sparePartID: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
  stockInQuantity: { type: Number, required: true },
  stockInDate: { type: Date, default: Date.now },
  receivedBy: { type: String, required: true }
});

module.exports = mongoose.model('StockIn', stockInSchema); 