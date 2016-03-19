
const ConfigDescriptor = require("./ConfigDescriptor.js")
const path = require('path')

function isPropertiesFile(filename)
{
  var ext = path.extname(filename).replace('.','')
  return ext.toLowerCase() == "properties"
}

module.exports = new ConfigDescriptor("properties",isPropertiesFile)
