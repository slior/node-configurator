
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
    var resource = resolve(resourcePathFrom(req))
    try {
      switch (resource.type)
      {
        case FILE_RESOURCE :
          res.json(configFile.readFile(resource.fspath))
          break;
        case PROP_RESOURCE :
          respondWithPlainValue(res,configFile.readProp(resource.fspath,resource.propName),200)
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

function propWriteFunc(writeBlock)
{
  return (rq,rs) => {
    const resource = ConfigResource.resolve(resourcePathFrom(rq))
    if (resource.type != ConfigResource.PROP_RESOURCE)
      rs.status(400).send("Path does not point at a property")
    writeBlock(rq,rs,resource)
  }
}

function setup(router)
{
  router.get('/',heartbeat)
  router.get('/s/*',resources)
  router.get(CONFIGS_PATH,resourceList)

//POST: update an existing property
  router.post("/s/*",propWriteFunc((req,res,resource) => {
    if (!configFile.propExists(resource.fspath,resource.propName))
      res.status(404).send("Property " + resource.propName + " does not exist")
    else {
      const newValue = valueFrom(req)
      configFile.setProp(resource.fspath,resource.propName,newValue)
      info("Succesfully updated " + resource.path + " to '" + newValue + "'")
      respondWithPlainValue(res,newValue,200)
    }
  }))

//PUT: create a new property
  router.put("/s/*",propWriteFunc( (req,res,resource) => {
    if (configFile.propExists(resource.fspath,resource.propName))
      res.status(400).send("Can't create an existing property: " + resource.path)
    else {
      const newValue = valueFrom(req)
      configFile.setProp(resource.fspath,resource.propName,newValue)
      info("Succesfully created value '" + newValue + "' at " + resource.path)
      res.set("Location",resource.path)
      respondWithPlainValue(res,newValue,201)
    }
  }))

  router.delete("/s/*",propWriteFunc((req,res,resource) => {
    configFile.removeProp(resource.fspath,resource.propName)
    info("Removed " + resource.path)
    res.status(204).send("")
  }))

}

module.exports = {
  setupOn : setup
}
