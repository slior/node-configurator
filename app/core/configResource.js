var path = require('path')
var isFile = require("../util/fsutil.js").isFile

const TYPE_FILE = "file"
const TYPE_PROP = "property"


function resolve(resourcePath)
{
  var filename = path.join(process.cwd(),resourcePath)
  var ret = {}
  if (isFile(filename))
  {
    ret.type = TYPE_FILE
    ret.path = resourcePath
    ret.fspath = filename
  }
  else {
    var pathObj = path.parse(filename)
    if (isFile(pathObj.dir)) {
      ret.type = TYPE_PROP
      // ret.path = pathObj.dir + "/" + pathObj.base
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
