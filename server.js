
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var dbg = console.log
var info = console.info

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

var program = require('commander')

program
  .version('0.0.1')
  .usage("Configurator: config files server")
  .option('-r, --root <dir>', "Root path, relative to current working dir")
  .parse(process.argv)


var root = program.root || '.'
app.set('root',root)
info("Root path: " + root)

var port = 8081

var router = express.Router();
var CONFIGS_PATH = "/s"

router.use((req,res,next) => {
  dbg("[REQ] " + req.method + " " + req.path);
  next();
})

router.get('/',function(req,res) {
  res.json({ message : "Configurator ON"})
})

router.get(CONFIGS_PATH,require('./app/core/configList.js'))

app.use('/config',router);

app.listen(port);
console.log("Configurator on at " + port);
