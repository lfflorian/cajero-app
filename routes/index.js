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
var ipAdress = '172.11.23.78';
const testFolder = `\\\\${ipAdress}\\\\sharedFolder\\\\prueba.txt`;
router.post('/',middlewares, (req, res) => {
  var cadena = `${req.body.usuario},${req.body.cuenta},${req.body.monto}\r\n`;
    fs.appendFile(testFolder,cadena, (err) => {
      if (err) return console.log(err);
    });
  res.render('index', {title: 'Escrito Correctamente'})
})

router.get('/configuracion', function(req, res, next) {
  res.render('configuration', {direction: ipAdress})
});

router.post('/configuracion',middlewares, (req, res) => {
  ipAdress = req.body.ip;
  res.render('index', {title: 'configuración realizada'})
});

module.exports = router;
