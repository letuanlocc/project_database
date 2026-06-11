const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

// router.get('/', productCtrl.index);
// router.get('/newCustomer', productCtrl.newCustomer);
// router.post('/newOrder', productCtrl.newOrder);
// router.get('/:id', productCtrl.detail);
// router.get('/edit/:id', productCtrl.editForm);
// router.post('/edit/:id', productCtrl.update);
// router.get('/delete/:id', productCtrl.delete);
router.post('/addEmployee', adminCtrl.addEmployee);
router.post('/addYard',adminCtrl.addYard);
router.post('/addService',adminCtrl.addService);
router.post('/deleteService/:id', adminCtrl.deleteService);
router.post('/deleteEmployee/:id', adminCtrl.deleteEmployee);
router.post('/deleteYard/:id', adminCtrl.deleteYard);
router.get('/service', adminCtrl.getAllService);
router.get('/employees', adminCtrl.getAllEmployees);
router.get('/yard', adminCtrl.getAllYard);

module.exports = router;