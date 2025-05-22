const express = require('express');
const router = express.Router();
const stockOutController = require('../controllers/stockOutController');

router.post('/', stockOutController.createStockOut);
router.get('/', stockOutController.getStockOuts);
router.get('/:id', stockOutController.getStockOutById);
router.put('/:id', stockOutController.updateStockOut);
router.delete('/:id', stockOutController.deleteStockOut);

module.exports = router; 