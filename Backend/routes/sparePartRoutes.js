const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/sparePartController');

router.post('/', sparePartController.createSparePart);
router.get('/', sparePartController.getSpareParts);
router.get('/:id', sparePartController.getSparePartById);
router.put('/:id', sparePartController.updateSparePart);
router.delete('/:id', sparePartController.deleteSparePart);

module.exports = router; 