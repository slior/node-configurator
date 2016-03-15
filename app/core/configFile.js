
const info = console.info
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

function setProp(filename,propName,value) {
  if (!filename) throw new Error("Invalid filename")
  if (!propName) throw new Error("Invalid property name")

  const allProps = readFile(filename)
  allProps[propName] = value;

  writeProperties(filename,allProps)

}

function removeProp(filename,propName) {
  if (!filename) throw new Error("Invalid filename")
  if (!propName) throw new Error("Invalid property name")

  const allProps = readFile(filename)
  if (!(delete allProps[propName])) throw new Error("Failed to remove " + propName)

  writeProperties(filename,allProps)
}

function writeProperties(filename,props)
{
  const PropWriter = require('properties')
  const stringifiedProps = PropWriter.stringify(props)

  const fs = require('fs')
  fs.writeFileSync(filename,stringifiedProps)
  info("File: " + filename + " updated")
}

module.exports = {
   readFile : readFile
  , readProp : readProp
  , setProp : setProp
  , removeProp : removeProp
  , err : {
    PROP_NOT_FOUND : PROP_NOT_FOUND
  }
}
