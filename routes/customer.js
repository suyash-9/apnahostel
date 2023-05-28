const express = require('express');
const customer_auth = require('../controllers/customer_auth');

const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

const router = express.Router();


router.post('/register', customer_auth.register );

router.post('/login', customer_auth.login );

router.get('/logout', customer_auth.logout );

router.get('/dashboard', customer_auth.isLoggedIn, function(req, res, next) {

    if( req.customer ) {
    var sql='SELECT * FROM listing';
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('customer/customerdashboard', { title: 'User Dashboard', listingData: data});
  });
    } else {
      res.redirect('/customerlogin');
    }
  });

  router.get('/donations', customer_auth.isLoggedIn, function(req, res, next) {

    if( req.customer ) {
     var id = req.customer.id;
    var sql=`SELECT A.orderId,A.amount,A.createdAt,A.status,B.name FROM donationdetails A, listing B WHERE A.customerId = ${id} AND B.id=A.listingId`;
    db.query(sql, function (err, data, fields) {
    
        console.log(data);
        res.render('customer/customerdonations', { title: 'User bookings', details : data});
  });
    }
  });


module.exports = router;