const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');

// router.use(protect);

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', protect, productController.create);
router.put('/:id', protect, productController.update);
router.delete('/:id', protect, productController.remove);

module.exports = router;
