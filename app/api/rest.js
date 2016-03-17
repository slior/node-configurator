
const CONFIGS_PATH = "/s"
const dbg = console.log

function heartbeat(req,res)
{
  res.json({ message : "Configurator ON"})
}

function resources(req,res)
{
  const ConfigResource = require("../core/configResource.js")
  const configFile = require("../core/configFile.js")
  with (ConfigResource)
  {
    var resource = resolve(req.path.replace(CONFIGS_PATH,""))
    try {
      switch (resource.type)
      {
        case FILE_RESOURCE :
          res.json(configFile.readFile(resource.fspath))
          break;
        case PROP_RESOURCE :
          res.type(".txt")
          res.send(configFile.readProp(resource.fspath,resource.propName))
          break;
        default : throw "Could not resolve " + req.path; break;
      }
    } catch (e) {
      var err = (e.err && e.err == configFile.err.PROP_NOT_FOUND) ?
                  e.description : e.toString()
      console.error(err)
      res.status(404).send(err)
    }
  }
}

function resourceList(req,res)
{
  const CL = require('../core/configList.js')
  CL.findResources(req.app.get('root'),resources => res.json(resources))
}

function setup(router)
{
  router.get('/',heartbeat)
  router.get('/s/*',resources)
  router.get(CONFIGS_PATH,resourceList)
}

module.exports = {
  setupOn : setup
}
