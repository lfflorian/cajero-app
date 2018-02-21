var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var router = express.Router();

const middlewares = [
  bodyParser.urlencoded()
]


/* GET home page. */
const testFolder = '\\\\172.11.23.78\\\\sharedFolder\\\\prueba.txt';
router.get('/', function(req, res, next) {
  //lectura
  fs.readFile(testFolder, {encoding: 'utf-8'}, (err, data) => {
    if (err) return console.log(err);
    res.render('index', { title: data});
  });

  //Escritura
  fs.appendFile(testFolder,"Mensaje", (err) => {
    if (err) return console.log(err);
  });
});

router.post('/',middlewares, (req, res) => {
  var cadena = req.body.usuario + "," + req.body.monto + "," + req.body.cuenta;
  fs.appendFile(testFolder,cadena, (err) => {
    if (err) return console.log(err);
    console.log(req);
  });
})


//ruta de registro
router.get('/registro', function(req, res, next){
  fs.appendFile(testFolder,"Otro Mensaje", (err) => {
    if (err) return console.log(err);
  });
})
module.exports = router;
