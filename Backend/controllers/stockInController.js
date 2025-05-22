const StockIn = require('../models/stockIn');
const SparePart = require('../models/sparePart');

// Create StockIn (and increase SparePart quantity)
exports.createStockIn = async (req, res) => {
  try {
    const { stockInID, sparePartID, stockInQuantity, stockInDate, receivedBy } = req.body;
    const sparePart = await SparePart.findById(sparePartID);
    if (!sparePart) return res.status(404).json({ error: 'SparePart not found' });
    const stockIn = new StockIn({ stockInID, sparePartID, stockInQuantity, stockInDate, receivedBy });
    await stockIn.save();
    sparePart.quantity += stockInQuantity;
    await sparePart.save();
    res.status(201).json(stockIn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all StockIn
exports.getStockIns = async (req, res) => {
  try {
    const stockIns = await StockIn.find().populate('sparePartID');
    res.json(stockIns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get StockIn by ID
exports.getStockInById = async (req, res) => {
  try {
    const stockIn = await StockIn.findById(req.params.id).populate('sparePartID');
    if (!stockIn) return res.status(404).json({ error: 'StockIn not found' });
    res.json(stockIn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update StockIn
exports.updateStockIn = async (req, res) => {
  try {
    const { stockInQuantity, stockInDate, receivedBy } = req.body;
    const stockIn = await StockIn.findById(req.params.id);
    if (!stockIn) return res.status(404).json({ error: 'StockIn not found' });
    if (stockInQuantity !== undefined) stockIn.stockInQuantity = stockInQuantity;
    if (stockInDate) stockIn.stockInDate = stockInDate;
    if (receivedBy) stockIn.receivedBy = receivedBy;
    await stockIn.save();
    res.json(stockIn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete StockIn
exports.deleteStockIn = async (req, res) => {
  try {
    const stockIn = await StockIn.findByIdAndDelete(req.params.id);
    if (!stockIn) return res.status(404).json({ error: 'StockIn not found' });
    res.json({ message: 'StockIn deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 