const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
router.post('/Checknumber', asyncHandler(orderCtrl.Checknumber));
router.post('/createCustomer', asyncHandler(orderCtrl.createCustomer));
router.get('/yards', asyncHandler(orderCtrl.getYardsByType));
router.post('/createBooking', asyncHandler(orderCtrl.createBooking));
router.get('/services',asyncHandler(orderCtrl.getServices))
module.exports = router;