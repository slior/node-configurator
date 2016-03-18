
const registeredTypes = {}

function isValidConfigType(desc)
{
  with ({ t : o => typeof(o) })
  {
    return t(desc) == "object" && t(desc.type) == "string" && desc.type
        && t(desc.isConfigFile) == "function"
  }
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
