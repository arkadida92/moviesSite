var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.authenticated) {
        let isAdmin = req.session.isAdmin
        res.render('menuPage', { isAdmin });
    }
    else {
        res.redirect('/login')
    }

});

module.exports = router;
