const express = require('express');
const admin_auth = require('../controllers/admin_auth');

const mysql = require("mysql");
const fs= require('fs')

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

const router = express.Router();


router.post('/login', admin_auth.login );

router.get('/logout', admin_auth.logout );

router.get('/dashboard', admin_auth.isLoggedIn, function(req, res, next) {

  if( req.admin ) {
  var sql='SELECT * FROM listing';
  db.query(sql, function (err, data, fields) {
  if (err) throw err;
  res.render('admin/admindashboard', { title: 'Admin Dashboard', listingData: data});
});
  } else {
    res.redirect('/adminlogin');
  }
});

router.get('/add', admin_auth.isLoggedIn, function(req, res, next) {

  if( req.admin ) {
  res.render('admin/add_form');
} else {
  res.redirect('/adminlogin');
}
});

router.post('/insert', admin_auth.isLoggedIn, function(req, res, next) { 

  if( req.admin ) {
    const { name, location, price, info, image } = req.body;
    console.log(image)    
    db.query('INSERT INTO listing SET ?', { name:name, location:location, price:price, info:info, image:image }, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        var sql='SELECT * FROM listing';
  db.query(sql, function (err, data, fields) {
  if (err) throw err;
  res.render('admin/admindashboard', { title: 'Admin Dashboard',message: 'Listing Added', listingData: data});
          
        });
      }
    })
} else {
  res.redirect('/adminlogin');
}
});


//edit

router.get('/edit/:id',admin_auth.isLoggedIn, function(req, res, next) {
  if( req.admin ) {
  var listingId= req.params.id;
  var sql=`SELECT * FROM listing WHERE id=${listingId}`;
  db.query(sql, function (err, data) {
    if (err) throw err;
   
    res.render('admin/edit_form', { editData: data[0]});
  });
} else {
  res.redirect('/adminlogin');
}
});

router.post('/edit/:id', function(req, res, next) {
var id= req.params.id;
var updateData=req.body;
var sql = `UPDATE listing SET ? WHERE id= ?`;
db.query(sql, [updateData, id], function (err, data) {
if (err) throw err;
console.log(data.affectedRows + " record(s) updated");
});
var sql='SELECT * FROM listing';
db.query(sql, function (err, data, fields) {
if (err) throw err;
res.render('admin/admindashboard', { title: 'Admin Dashboard',message: 'Edit Successful', listingData: data});
        
      });

});

//deletion

router.get('/delete/:id',admin_auth.isLoggedIn, function(req, res, next) {
  if( req.admin ) {
  var id= req.params.id;
    var sql = 'DELETE FROM listing WHERE id = ?';
    db.query(sql, [id], function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
  });
  var sql='SELECT * FROM listing';
db.query(sql, function (err, data, fields) {
if (err) throw err;
res.render('admin/admindashboard', { title: 'Admin Dashboard',message: 'Deletion Successful', listingData: data});
        
      });
} else {
  res.redirect('/adminlogin');
}
});




module.exports = router;