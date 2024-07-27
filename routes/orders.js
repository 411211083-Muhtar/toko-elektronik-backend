const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/:order_id', orderController.getOrderById);
router.put('/:order_id', orderController.updateOrder);
router.delete('/:order_id', orderController.deleteOrder);

module.exports = router;
