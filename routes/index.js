var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

//formato de fecha
var fecha = new Date();

var router = express.Router();

const middlewares = [
  bodyParser.urlencoded()
]


/* GET home page. */
/*router.get('/', function(req, res, next) {
    res.render('index', { title: 'Cajero-App'});
}); */

/* GET post request */
// var ipAdress = '172.11.23.78';
//var ipAdress = '172.31.2.98';
var ipAdress = '192.168.0.15';
const testFolder = `\\\\${ipAdress}\\\\sharedFolder\\\\prueba.txt`;

router.get('/', (req, res, next)=> {
  var conexion = conect();
  var usuarios = userExtract();
  console.log(usuarios);
  res.render('index', {title: conexion})
})

/* funciones */
function conect() {
  var msg;
    try {
      fs.accessSync(testFolder)
      msg = 'Conexión realizada con exito!'
    } catch (err) {
      msg = 'No fue posible conectar al servidor'
    }
  return msg;
}


function userExtract() {
  var usuarios = new Array();
  var resul = fs.readFile(testFolder, {encoding: 'utf-8'}, (err, file) => {
    if (err) return console.log(err);
      var lineas = file.split("\r\n");
      lineas.forEach(linea => {
        valor = linea.split(",");
        usuarios.push(valor[0])
      });
    //console.log(usuarios)
  });
  return resul;
}


/*router.post('/',middlewares, (req, res) => {
  var cadena = `${req.body.usuario},${req.body.cuenta},${req.body.monto},${(dateFormat(fecha,"dd/mm/yyyy"))}\r\n`;
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
});*/

module.exports = router;
