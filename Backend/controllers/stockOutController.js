const StockOut = require('../models/stockOut');
const SparePart = require('../models/sparePart');

// Create StockOut (and decrease SparePart quantity)
exports.createStockOut = async (req, res) => {
  try {
    const { stockOutID, sparePartID, stockOutQuantity, stockOutDate, stockOutUnitPrice, approvedBy } = req.body;
    const sparePart = await SparePart.findById(sparePartID);
    if (!sparePart) return res.status(404).json({ error: 'SparePart not found' });
    if (sparePart.quantity < stockOutQuantity) return res.status(400).json({ error: 'Insufficient stock' });
    const stockOut = new StockOut({ stockOutID, sparePartID, stockOutQuantity, stockOutDate, stockOutUnitPrice, approvedBy });
    await stockOut.save();
    sparePart.quantity -= stockOutQuantity;
    await sparePart.save();
    res.status(201).json(stockOut);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all StockOut
exports.getStockOuts = async (req, res) => {
  try {
    const stockOuts = await StockOut.find().populate('sparePartID');
    res.json(stockOuts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get StockOut by ID
exports.getStockOutById = async (req, res) => {
  try {
    const stockOut = await StockOut.findById(req.params.id).populate('sparePartID');
    if (!stockOut) return res.status(404).json({ error: 'StockOut not found' });
    res.json(stockOut);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update StockOut
exports.updateStockOut = async (req, res) => {
  try {
    const { stockOutQuantity, stockOutDate, stockOutUnitPrice, approvedBy } = req.body;
    const stockOut = await StockOut.findById(req.params.id);
    if (!stockOut) return res.status(404).json({ error: 'StockOut not found' });
    if (stockOutQuantity !== undefined) stockOut.stockOutQuantity = stockOutQuantity;
    if (stockOutDate) stockOut.stockOutDate = stockOutDate;
    if (stockOutUnitPrice !== undefined) stockOut.stockOutUnitPrice = stockOutUnitPrice;
    if (approvedBy) stockOut.approvedBy = approvedBy;
    await stockOut.save();
    res.json(stockOut);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete StockOut
exports.deleteStockOut = async (req, res) => {
  try {
    const stockOut = await StockOut.findByIdAndDelete(req.params.id);
    if (!stockOut) return res.status(404).json({ error: 'StockOut not found' });
    res.json({ message: 'StockOut deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 