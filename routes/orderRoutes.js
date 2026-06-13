const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// router.get('/', productCtrl.index);
// router.get('/newCustomer', productCtrl.newCustomer);
// router.post('/newOrder', productCtrl.newOrder);
// router.get('/:id', productCtrl.detail);
// router.get('/edit/:id', productCtrl.editForm);
// router.post('/edit/:id', productCtrl.update);
// router.get('/delete/:id', productCtrl.delete);
router.post('/Checknumber', asyncHandler(orderCtrl.Checknumber));
router.post('/createCustomer', asyncHandler(orderCtrl.createCustomer));
router.get('/yards', asyncHandler(orderCtrl.getYardsByType));
router.post('/createBooking', asyncHandler(orderCtrl.createBooking));

module.exports = router;