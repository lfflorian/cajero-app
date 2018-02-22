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
var ipAdress = '172.11.23.78';
//var ipAdress = '172.31.2.98';
//var ipAdress = '192.168.0.15';
const testFolder = `\\\\${ipAdress}\\\\sharedFolder\\\\prueba.txt`;

/// pagina de inicio
router.get('/', (req, res, next)=> {
  var conexion = conect();
  var usuarios = userExtract();
  res.render('index', {title: conexion, data: usuarios})
})

router.post('/',middlewares, (req, res)=> {
  var user = req.body.usuario;
  res.render('transaction', {usuario:user})
})

/// crear usuario
router.get('/createUser', (req, res, next)=> {
  res.render('create-user')
})

router.post('/createUser',middlewares, (req, res)=> {
  var user = req.body.nombre.charAt(0) + req.body.apellido.charAt(0);
  res.render('transaction', {usuario:user})
})

/// configuracion
router.get('/configuracion', (req, res, next)=> {
  res.render('configuration', {direction: ipAdress})
})

router.post('/configuracion',middlewares, (req, res)=> {
  ipAdress = req.body.ip;
  res.render('configuration', {direction: ipAdress})
})

router.post('/test',middlewares, (req, res)=> {
  var conexion = conect();
  res.render('configuration', {direction: ipAdress, msg: conexion})
})


/* funciones */
function conect() {
  var msg;
    /*try {
      var smsg = fs.existsSync(testFolder,fs.constants.R_OK | fs.constants.W_OK)
      msg = 'Conexión realizada con exito!'
      console.log(smsg)
    } catch (err) {
      msg = 'No fue posible conectar al servidor'
      console.log('err')
    }*/
    if (fs.existsSync(testFolder))
    {
      msg = 'Conexión realizada con exito!'
      console.log('ok')
    } else 
    {
      msg = 'No fue posible conectar al servidor'
      console.log('err')
    }
  return msg;
}

function userExtract() {
  var usuarios = new Array();
  var file = fs.readFileSync(testFolder,'utf-8');
  var lineas = file.split("\r\n");
  lineas.forEach(linea => {
    var valor = linea.split(",");
    usuarios.push(valor[0])
  });
  return usuarios;
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
