var express = require('express');
var fs = require('fs');

var router = express.Router();

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

module.exports = router;
