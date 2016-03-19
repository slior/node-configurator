
function ConfigDescriptor(_name, _isConfigFile)
{
  const type = o => typeof(o)
  if (!_name || type(_name) != "string") throw new Error("Invalid name for config descriptor")
  if (type(_isConfigFile) != "function") throw new Error("Invalid isConfigFile function")
  this.name = _name
  this.isConfigFile = _isConfigFile

  return this;
}

module.exports = ConfigDescriptor
