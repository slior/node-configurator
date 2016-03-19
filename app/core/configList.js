

var fs = require('fs')
var findit = require('findit2')
require("../util/jsexts.js").obj()
var isFile = require("../util/fsutil.js").isFile
var path = require('path')

const ConfigRegistry = require("./config/ConfigTypeRegistry.js")

var str = JSON.stringify
var dbg = console.log

function isConfigFile(name)
{
  if (!isFile(name)) return false;
  return typeof(ConfigRegistry.configTypes().values()
                       .find(ct => ct.isConfigFile(name))) != "undefined"
}

function findConfigFiles(path,callback)
{
  var ret = []

  var fsWalker = findit(path)
  fsWalker.on('file',
    (file,stat,linkPath) => {
      if (isConfigFile(file))
        ret.push(file)
    })

  fsWalker.on('end',() => { callback(ret) })
}

function configResourceList(root,callback)
{
  var basePath = path.join(process.cwd(),root)
  dbg('base path: ' + basePath)
  findConfigFiles(basePath,
                     function(files) {
                       var relativeFiles = files.map(f => f.replace(basePath.replace('/','\\'),''))
                      callback({ files : relativeFiles})
                     })
}

module.exports = {
  findResources : configResourceList
}
