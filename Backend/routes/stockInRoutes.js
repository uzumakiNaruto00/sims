const express = require('express');
const router = express.Router();
const stockInController = require('../controllers/stockInController');

router.post('/', stockInController.createStockIn);
router.get('/', stockInController.getStockIns);
router.get('/:id', stockInController.getStockInById);
router.put('/:id', stockInController.updateStockIn);
router.delete('/:id', stockInController.deleteStockIn);

module.exports = router; 