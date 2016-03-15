
const express = require('express')
const app = express();
var bodyParser = require('body-parser')
var info = console.info
const REST_API = require('./app/api/rest.js')

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

router.use((req,res,next) => {
  info("[REQ] " + req.method + " " + req.path);
  next();
})

router.get('/',REST_API.Heartbeat)

router.get('/s/*',REST_API.Resource)

router.get(REST_API.CONFIGS_PATH,REST_API.ResourceList)

app.use('/config',router);

app.listen(port);
console.log("Configurator on at " + port);
