
const registeredTypes = {}
const ConfigDescriptor = require('./ConfigDescriptor.js')
const dbg = console.log
function isValidConfigType(desc)
{
  return desc.constructor == ConfigDescriptor
}

function registerConfigType(configTypeDescriptor)
{
  if (isValidConfigType(configTypeDescriptor))
    registeredTypes[configTypeDescriptor.type] = configTypeDescriptor
  else
    throw new Error("Invalid configuration type descriptor")
}

function getConfigTypes()
{
  return registeredTypes;
}


module.exports = {
  register : registerConfigType
  , configTypes : getConfigTypes
}
