
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var isFile = require("./app/util/fsutil.js").isFile
var configFile = require("./app/core/configFile.js")
var configResource = require("./app/core/configResource.js")
var path = require('path')
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

router.get('/s/*',function(req,res) {
  var ret = {}
  var err = null
  with (configResource)
  {
    var resource = resolve(req.path.replace(CONFIGS_PATH,""))
    try {
      switch (resource.type)
      {
        case FILE_RESOURCE : ret = configFile.readFile(resource.fspath); break;
        case PROP_RESOURCE :
          ret[resource.propName] = configFile.readProp(resource.fspath,resource.propName)
          break;
        default : err = "Could not resolve " + req.path; break;
      }
    } catch (e) {
      err = (e.err && e.err == configFile.err.PROP_NOT_FOUND) ?
              e.description : e.toString()
    }
  }
  if (err)
  {
    console.error(err)
    res.status(404).send(err)
  }
  else
    res.json(ret)

})

router.get(CONFIGS_PATH,require('./app/core/configList.js'))

app.use('/config',router);

app.listen(port);
console.log("Configurator on at " + port);
