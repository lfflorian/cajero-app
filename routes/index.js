var express = require('express');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
const testFolder = '\\\\172.11.23.78\\\\sharedFolder\\\\prueba.txt';
router.get('/', function(req, res, next) {
  /*fs.readdir(testFolder, (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
      console.log(file);
      archivo = file;
      res.render('index', { title: file});
    });
  }); */

  fs.readFile(testFolder, {encoding: 'utf-8'}, (err, files) => {
    if (err) return console.log(err);

  });

});




module.exports = router;
