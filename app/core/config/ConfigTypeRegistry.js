
require("../../util/jsexts.js").obj()
const ConfigDescriptor = require('./ConfigDescriptor.js')
const isFile = require("../../util/fsutil.js").isFile

const registeredTypes = {}
const dbg = console.log


function isValidConfigType(desc)
{
  return desc.constructor == ConfigDescriptor
}

function registerConfigType(configTypeDescriptor)
{
  if (isValidConfigType(configTypeDescriptor))
    registeredTypes[configTypeDescriptor.name] = configTypeDescriptor
  else
    throw new Error("Invalid configuration type descriptor")
}

function getConfigTypes()
{
  return registeredTypes;
}

function isConfigFile(filename)
{
  return isFile(filename) &&
         typeof(registeredTypes.values()
                               .find(ct => ct.isConfigFile(filename))) != "undefined"
}

module.exports = {
    register : registerConfigType
  , configTypes : getConfigTypes
  , isConfigFile : isConfigFile
}
