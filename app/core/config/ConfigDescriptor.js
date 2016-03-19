
function ConfigDescriptor(_name, _isConfigFile,_readFile,_writeFile)
{
  const type = o => typeof(o)
  if (!_name || type(_name) != "string") throw new Error("Invalid name for config descriptor")
  if (type(_isConfigFile) != "function") throw new Error("Invalid isConfigFile function")
  if (type(_readFile) != "function") throw new Error("Invalid readFile function")
  if (type(_writeFile) != "function") throw new Error("Invalid writeFile function")
  this.name = _name
  this.isConfigFile = _isConfigFile
  this.readFile = _readFile
  this.writeFile = _writeFile

  return this;
}

module.exports = ConfigDescriptor
