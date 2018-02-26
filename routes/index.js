var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

//formato de fecha
var fecha;

var router = express.Router();

const middlewares = [
  bodyParser.urlencoded()
]

/* GET post request */
var ipAdress = '172.11.23.78';
//var ipAdress = '172.31.2.98';
//var ipAdress = 'ALEXA';  //Aleexa
//var ipAdress = '169.254.217.38';
//var ipAdress = '192.168.0.15';
var testFolder = `\\\\${ipAdress}\\\\sharedFolder`;

/// pagina de inicio
router.get('/', (req, res, next)=> {
  //try catch 
  try {
    var conexion = conect();
    var usuarios = userExtract();
    res.render('index', {title: conexion, data: usuarios})
  } catch (err)
  {
    res.render('index', {title: 'No se pudo conectar al servidor, Favor realizar configuración', data: usuarios})
  }
  
})

router.post('/',middlewares, (req, res)=> {
  var user = req.body.usuario;
  var cuentas = cuentaExtract();
  res.render('transaction', {usuario:user, cuentas: cuentas})
})

/// crear usuario
router.get('/createUser', (req, res, next)=> {
  res.render('create-user')
})

router.post('/createUser',middlewares, (req, res)=> {
  var userid = req.body.nombre.charAt(0) + req.body.apellido.charAt(0);
  var usuarios = userExtract();
  var cuentas = cuentaExtract();
  var user = `${userid.toUpperCase()}${pad(usuarios.length+1,4)}`;
  res.render('transaction', {usuario:user, cuentas: cuentas})
})

/// configuracion
router.get('/configuracion', (req, res, next)=> {
  res.render('configuration', {direction: ipAdress})
})

router.post('/configuracion',middlewares, (req, res)=> {
  ipAdress = req.body.ip;
  testFolder = `\\\\${ipAdress}\\\\sharedFolder`;
  res.render('configuration', {direction: ipAdress})
})

router.post('/test',middlewares, (req, res)=> {
  var conexion = conect();
  res.render('configuration', {direction: ipAdress, msg: conexion})
})

//transaccion
router.post('/transaction',middlewares, (req, res)=> {
  var operacion = (req.body.operacion == 'retirar') ? 'R' : 'D';
  var monto = req.body.monto;
  var cuenta = req.body.cuenta;
  var total = transaction(operacion, monto, cuenta);
  var usuarios;
  //crearCuenta

  if (validacion(total))
  {
    escrituraArchivo(
      req.body.usuario,
      operacion,
      monto,
      total,
      cuenta,
    )

    usuarios = userExtract();
    res.render('index', {title: `Transacción realizada en la cuenta ${cuenta}: Saldo total: ${total}`, data: usuarios})
  } else 
  {
    usuarios = userExtract();
    res.render('index', {title: 'no hay suficiente saldo para realizar retiro', data: usuarios})
  }
})

/* funciones */
function conect() {
  var msg;
  var fileText = testFolder + '\\\\prueba.txt';
    if (fs.existsSync(fileText))
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

//funciones de la transicion
function transaction(operacion, monto, cuenta) {
  fileText = testFolder + '\\\\' + cuenta + '.txt';
  var file = fs.readFileSync(fileText,'utf-8');
  var saldos = file.trim().split("\r\n");
  var noTransacciones = saldos.length-1;
  var saldo = parseInt(saldos[noTransacciones]);
  
  var total;
  if (operacion == 'D') {
    total = saldo + parseInt(monto);
  } else 
  {
    total = saldo - parseInt(monto); 
  }
  return total;
}

function validacion(monto)
{
  return (monto < 0) ? false : true;
}

function escrituraArchivo(usuario, operacion, saldo, montoTotal, cuenta)
{
  fecha = new Date();
  var fileText = testFolder + '\\\\prueba.txt';
  var fileCuenta = testFolder + '\\\\' + cuenta + '.txt';
  var file = fs.readFileSync(fileText,'utf-8');
  var transacciones = file.trim().split("\r\n");
  console.log(transacciones);
  var noTransaccion = `T${pad(transacciones.length,4)}`;

  var cadena = `\r\n${usuario},${(dateFormat(fecha,"dd/mm/yyyy"))},${(dateFormat(fecha,"hh:mm"))},${noTransaccion},${saldo},${operacion},${montoTotal},${cuenta}`;
  fs.appendFile(fileText,cadena, (err) => {
    if (err) return console.log(err);
  });
  fs.appendFile(fileCuenta,'\r\n'+montoTotal, (err) => {
    if (err) return console.log(err);
  });
}
//fin de funciones de la transicion7

function createAcount() {
  var fileText = testFolder + '\\\\prueba.txt';
  var file = fs.readFileSync(fileText,'utf-8');
  var lineas = file.split("\r\n");
  var noCuentas = lineas.length;
  var noCuenta = `C${pad(noCuentas, 4)}`;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function userExtract() {
  var fileText = testFolder + '\\\\prueba.txt';
  var usuarios = new Array();
  var file = fs.readFileSync(fileText,'utf-8');
  var lineas = file.split("\r\n");
  lineas.forEach(linea => {
    var valor = linea.split(",");
    if (!usuarios.includes(valor[0]))
    {
      usuarios.push(valor[0])
    }
  });
  return usuarios;
}

function cuentaExtract() {
  var fileText = testFolder + '\\\\prueba.txt';
  var cuentas = new Array();
  var file = fs.readFileSync(fileText,'utf-8');
  var lineas = file.split("\r\n");
  lineas.forEach(linea => {
    var valor = linea.split(",");
    if (!cuentas.includes(valor[7]))
    {
      cuentas.push(valor[7])
    }
  });
  return cuentas;
}

module.exports = router;
