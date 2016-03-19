
const registry = require("./config/ConfigTypeRegistry.js")

const PROP_NOT_FOUND = 1
const dbg = console.log
// const info = console.info



/**
  Read a configuration file and return all configurations as key - value pairs in a single object.
 */
function readFile(filename)
{
  return registry.descriptorFor(filename).readFile(filename)
}

function readProp(filename,propName) {
  if (!propExists(filename,propName))
    throw { err : PROP_NOT_FOUND, description : "property not found"}
  const props = readFile(filename) //TODO: this is reading the file a 2nd time, should probably fix this.
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
  registry.descriptorFor(filename).writeFile(filename,props)
}

function propExists(filename,propName)
{
  const props = readFile(filename)
  return typeof(props[propName]) != "undefined"
}

module.exports = {
   readFile : readFile
  , readProp : readProp
  , setProp : setProp
  , removeProp : removeProp
  , propExists : propExists
  , err : {
    PROP_NOT_FOUND : PROP_NOT_FOUND
  }
}
