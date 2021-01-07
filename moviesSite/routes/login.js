var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', (req, res, next) => {
    if (req.session.authenticated) {
        res.redirect('/menu');
    }
    else {
        console.log(req.session.reachedTran)
        res.render('loginPage', { isReachedTran: req.session.reachedTran })
    }

});

module.exports = router;
