
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
          respondWithPlainValue(res,configFile.readProp(resource.fspath,resource.propName),200)
          // res.type(".txt")
          // res.send(configFile.readProp(resource.fspath,resource.propName))
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
  return request.body || "";
}

function respondWithPlainValue(response,val,status)
{
  response.type(".txt")
  response.status(status||200).send(val)
}

function setProp(req,res)
{
  const resource = ConfigResource.resolve(resourcePathFrom(req))
  if (resource.type != ConfigResource.PROP_RESOURCE)
    res.status(400).send("No property to set at given path")

  const propExists = configFile.propExists(resource.fspath,resource.propName)
  const newValue = valueFrom(req)

  configFile.setProp(resource.fspath,resource.propName,newValue)
  info("Succesfully set value '" + newValue + "' to " + resource.path)
  if (propExists)
    respondWithPlainValue(res,newValue,200)
  else { //new property created
    res.set("Location",resource.path)
    respondWithPlainValue(res,newValue,201)
  }
}

function deleteProp(req,res)
{
  const resource = ConfigResource.resolve(resourcePathFrom(req))
  if (resource.type != ConfigResource.PROP_RESOURCE)
    res.status(400).send("No property to delete")

  configFile.removeProp(resource.fspath,resource.propName)
  info("Removed " + resource.path)

  res.status(204).send("")
}


function setup(router)
{
  router.get('/',heartbeat)
  router.get('/s/*',resources)
  router.get(CONFIGS_PATH,resourceList)

  router.post("/s/*",setProp)

  router.delete("/s/*",deleteProp)

}

module.exports = {
  setupOn : setup
}
