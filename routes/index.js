var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var router = express.Router();

const middlewares = [
  bodyParser.urlencoded()
]


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Cajero-App'});
});

/* GET post request */
const testFolder = '\\\\172.11.23.78\\\\sharedFolder\\\\prueba.txt';
router.post('/',middlewares, (req, res) => {
  res.render('/',function() {
    var cadena = `${req.body.usuario},${req.body.cuenta},${req.body.monto}\r\n`;
    fs.appendFile(testFolder,cadena, (err) => {
      if (err) return console.log(err);
    });
  })
})


module.exports = router;
