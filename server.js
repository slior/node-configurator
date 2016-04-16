
const express = require('express')
const app = express();
var bodyParser = require('body-parser')
var info = console.info
const REST_API = require('./app/api/rest.js')
const API_BASE = '/config'

app.use(bodyParser.text({type : "text/*"}))

var program = require('commander')

//Setting up program arguments
program
  .version('0.0.1')
  .usage("Configurator: config files server")
  .option('-r, --root <dir>', "Root path, relative to current working dir")
  .parse(process.argv)

//Setting up configuration types
const ConfigRegistry = require("./app/core/config/ConfigTypeRegistry.js")
const propsConfig = require("./app/core/config/PropertiesConfigDescriptor.js")

ConfigRegistry.register(propsConfig)

app.set('registry',ConfigRegistry)

//Setting up web interface
var root = program.root || '.'
app.set('root',root)
info("Root path: " + root)

var port = 8081

var router = express.Router();

router.use((req,res,next) => {
  info("[REQ] " + req.method + " " + req.path);
  next();
})

REST_API.setupOn(router,API_BASE)

app.use(API_BASE,router);

app.use('/views', express.static(__dirname + '/views'));
app.use('/lib/',express.static(__dirname + "/lib"));
//setting up views
// app.set('views','./views')
// app.set('view engine','jade')

// app.get('/', function (req, res) {
//   res.render('configs', { title: 'Configuration Files'});
// });



//Start listening for requests
app.listen(port);
console.log("Configurator on at " + port);
