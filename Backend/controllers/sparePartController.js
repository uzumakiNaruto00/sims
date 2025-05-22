const SparePart = require('../models/sparePart');

// Create SparePart
exports.createSparePart = async (req, res) => {
  try {
    const { sparePartID, name, category, unitPrice, quantity } = req.body;
    const sparePart = new SparePart({ sparePartID, name, category, unitPrice, quantity });
    await sparePart.save();
    res.status(201).json(sparePart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all SpareParts
exports.getSpareParts = async (req, res) => {
  try {
    const spareParts = await SparePart.find();
    res.json(spareParts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get SparePart by ID
exports.getSparePartById = async (req, res) => {
  try {
    const sparePart = await SparePart.findById(req.params.id);
    if (!sparePart) return res.status(404).json({ error: 'SparePart not found' });
    res.json(sparePart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update SparePart
exports.updateSparePart = async (req, res) => {
  try {
    const { name, category, unitPrice, quantity } = req.body;
    const sparePart = await SparePart.findById(req.params.id);
    if (!sparePart) return res.status(404).json({ error: 'SparePart not found' });
    if (name) sparePart.name = name;
    if (category) sparePart.category = category;
    if (unitPrice !== undefined) sparePart.unitPrice = unitPrice;
    if (quantity !== undefined) sparePart.quantity = quantity;
    await sparePart.save();
    res.json(sparePart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete SparePart
exports.deleteSparePart = async (req, res) => {
  try {
    const sparePart = await SparePart.findByIdAndDelete(req.params.id);
    if (!sparePart) return res.status(404).json({ error: 'SparePart not found' });
    res.json({ message: 'SparePart deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 