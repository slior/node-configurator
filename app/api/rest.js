
const CONFIGS_PATH = "/s"
const dbg = console.log
const info = console.info
const ConfigResource = require("../core/configResource.js")
const configFile = require("../core/configFile.js")
const resourcePathFrom = request => request.path.replace(CONFIGS_PATH,"")

function heartbeat(req,res)
{
  res.json({ message : "Configurator ON"})
}

function resources(req,res)
{
  with (ConfigResource)
  {
    // var resource = resolve(req.path.replace(CONFIGS_PATH,""))
    var resource = resolve(resourcePathFrom(req))
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

function valueFrom(request)
{
  return request.body;
}

function setProp(req,res)
{
  const resource = ConfigResource.resolve(resourcePathFrom(req))
  if (resource.type != ConfigResource.PROP_RESOURCE)
    throw new Error("No property to set found")

  const newValue = valueFrom(req)
  if (!newValue) throw new Error("Missing value to set to " + resource.path)

  configFile.setProp(resource.fspath,resource.propName,newValue)
  info("Succesfully set value '" + newValue + "' to " + resource.path)
  resources(req,res)
}

function setup(router)
{
  router.get('/',heartbeat)
  router.get('/s/*',resources)
  router.get(CONFIGS_PATH,resourceList)

  router.post("/s/*",setProp)

}

module.exports = {
  setupOn : setup
}
