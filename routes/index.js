const express = require('express');
const router = express.Router();
const mdw = require('../middelware/usermid.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('emptyView',{
      layout:'login',
    })
});
//get signin page.
router.get('/signin' ,function(req, res, next) {
    res.render('emptyView',{
      layout:'signin',
    })
});
//get addbook
router.get('/addbook',function(req, res, next) {
    res.render('emptyView',{
      layout:'addbook',
    })
});


module.exports = router;
