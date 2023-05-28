const express = require('express');



const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home');
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

router.get('/customerlogin', (req, res) => {
  res.render('customer/customerlogin');
});

router.get('/customerregister', (req, res) => {
  res.render('customer/customerregister');
});


router.get('/adminlogin', (req, res) => {
  res.render('admin/adminlogin');
});



module.exports = router;