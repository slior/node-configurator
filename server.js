
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var isFile = require("./app/util/fsutil.js").isFile
var configFile = require("./app/core/configFile.js")
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
  var filename = path.join(process.cwd(),req.path.replace(CONFIGS_PATH,""))
  dbg("Getting " + filename)
  if (isFile(filename))
    res.json(configFile.readFile(filename))
  else
  {
    dbg("Not a file, trying to resolve parent as config file...")
    var pathObj = path.parse(filename)
    if (isFile(pathObj.dir))
    {
      dbg("Success with: " + pathObj.dir)
      try {
        var value = configFile.readProp(pathObj.dir,pathObj.base)
        var ret = {}
        ret[pathObj.base] = value
        res.json(ret)
      } catch (e) {
        if (e.err && e.err == configFile.err.PROP_NOT_FOUND) {
          console.error(e.description)
          res.status(404).end()

        }
        else {
          console.error(e)
        }
      }
    }
    else
      res.status(404).end()
  }

})

router.get(CONFIGS_PATH,require('./app/core/configList.js'))

app.use('/config',router);

app.listen(port);
console.log("Configurator on at " + port);
