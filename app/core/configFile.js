
/**
  Read a configuration file and return all configurations as key - value pairs in a single object.
 */
function readFile(filename)
{
  var ret = {}
  var PropReader = require('properties-reader');
  var props = PropReader(filename)
  props.each((key,value) => {
    ret[key] = value
  })

  return ret;
}

const PROP_NOT_FOUND = 1
const dbg = console.log

function readProp(filename,propName) {
  var props = readFile(filename)
  if (typeof(props[propName]) == "undefined")
    throw { err : PROP_NOT_FOUND, description : "property not found"}
  else
    return props[propName]
}

module.exports = {
   readFile : readFile
  , readProp : readProp
  , err : {
    PROP_NOT_FOUND : PROP_NOT_FOUND
  }
}
