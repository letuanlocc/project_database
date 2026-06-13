const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

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
router.post('/addEmployee', asyncHandler(adminCtrl.addEmployee));
router.post('/addYard', asyncHandler(adminCtrl.addYard));
router.post('/addService', asyncHandler(adminCtrl.addService));
router.post('/deleteService/:id', asyncHandler(adminCtrl.deleteService));
router.post('/deleteEmployee/:id', asyncHandler(adminCtrl.deleteEmployee));
router.post('/deleteYard/:id', asyncHandler(adminCtrl.deleteYard));
router.get('/service', asyncHandler(adminCtrl.getAllService));
router.get('/employees', asyncHandler(adminCtrl.getAllEmployees));
router.get('/yard', asyncHandler(adminCtrl.getAllYard));

module.exports = router;