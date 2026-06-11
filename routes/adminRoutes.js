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
router.post('/addService',adminCtrl.addService);
router.post('/deleteService/:id', adminCtrl.deleteService);
router.get('/service', adminCtrl.getAllService);
router.get('/employees', adminCtrl.getAllEmployees);
router.get('/test', (req, res) => {
    res.send("ADMIN ROUTE OK");
});
module.exports = router;