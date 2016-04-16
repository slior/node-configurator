var path = require('path')
const ConfigRegistry = require("./config/ConfigTypeRegistry.js")
var isConfig = ConfigRegistry.isConfigFile //var because the unit test rewires it.

const TYPE_FILE = "file"
const TYPE_PROP = "property"

const dbg = console.log

function resolve(resourcePath)
{
  var filename = path.join(process.cwd(),resourcePath)
  var ret = {}
  var pathObj = path.parse(filename)

  if (isConfig(filename))
  {
    ret.type = TYPE_FILE
    ret.path = resourcePath
    ret.fspath = filename
    ret.name = pathObj.base
  }
  else {

    if (isConfig(pathObj.dir)) {
      ret.type = TYPE_PROP
      ret.path = resourcePath
      ret.fspath = pathObj.dir
      ret.propName = pathObj.base
    }
    else {
      ret.type = ""
    }
  }
  return ret;
}


module.exports = {
  resolve : resolve
  , FILE_RESOURCE : TYPE_FILE
  , PROP_RESOURCE : TYPE_PROP
}
