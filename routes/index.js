var express = require('express');
var router = express.Router();
var currentYear = new  Date().getFullYear()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcome', { title: 'Home', currentYear: currentYear

  });
});


router.get('/about', (reg, res, next) => {
  res.render('About', {title: 'About Page', currentYear: currentYear

  });
});
module.exports = router;
