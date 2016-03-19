
const ConfigDescriptor = require("./ConfigDescriptor.js")
const path = require('path')
const info = console.info

function isPropertiesFile(filename)
{
  var ext = path.extname(filename).replace('.','')
  return ext.toLowerCase() == "properties"
}

function readProps(filename)
{
  const ret = {}
  const PropReader = require('properties-reader');
  const props = PropReader(filename)
  props.each((key,value) => {
    ret[key] = value
  })

  return ret;
}

function writeProps(filename,props)
{
  const PropWriter = require('properties')
  const stringifiedProps = PropWriter.stringify(props)

  const fs = require('fs')
  fs.writeFileSync(filename,stringifiedProps)
  info("File: " + filename + " updated")
}

module.exports = new ConfigDescriptor("properties",isPropertiesFile,readProps,writeProps)
