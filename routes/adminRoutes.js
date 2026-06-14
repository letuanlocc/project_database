const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
router.post('/addEmployee', asyncHandler(adminCtrl.addEmployee));
router.post('/addYard', asyncHandler(adminCtrl.addYard));
router.post('/addService', asyncHandler(adminCtrl.addService));
router.post('/deleteService/:id', asyncHandler(adminCtrl.deleteService));
router.post('/deleteEmployee/:id', asyncHandler(adminCtrl.deleteEmployee));
router.post('/deleteYard/:id', asyncHandler(adminCtrl.deleteYard));
router.post('/updateEmployee/:id', asyncHandler(adminCtrl.updateEmployee));
router.post('/updateService/:id', asyncHandler(adminCtrl.updateService));
router.post('/updateYard/:id', asyncHandler(adminCtrl.updateYard));
router.get('/service', asyncHandler(adminCtrl.getAllService));
router.get('/employees', asyncHandler(adminCtrl.getAllEmployees));
router.get('/yard', asyncHandler(adminCtrl.getAllYard));

module.exports = router;