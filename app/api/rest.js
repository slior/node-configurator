
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
  var ret = {}
  with (ConfigResource)
  {
    var resource = resolve(req.path.replace(CONFIGS_PATH,""))
    try {
      switch (resource.type)
      {
        case FILE_RESOURCE : ret = configFile.readFile(resource.fspath); break;
        case PROP_RESOURCE :
          ret[resource.propName] = configFile.readProp(resource.fspath,resource.propName)
          break;
        default : throw "Could not resolve " + req.path; break;
      }
      res.json(ret)
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

module.exports = {
    Heartbeat : heartbeat
  , ResourceList : resourceList
  , Resource : resources
  , CONFIGS_PATH : CONFIGS_PATH
}
