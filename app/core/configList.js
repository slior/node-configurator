

var findit = require('findit2')
require("../util/jsexts.js").obj()
var path = require('path')

const ConfigRegistry = require("./config/ConfigTypeRegistry.js")

var str = JSON.stringify
var dbg = console.log

function isConfigFile(name)
{
  return ConfigRegistry.isConfigFile(name)
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
  //dbg('base path: ' + basePath)
  findConfigFiles(basePath,
                     function(files) {
                       var relativeFiles = files.map(f => path.join(root,f.replace(basePath.replace('/','\\'),'')))
                      callback({ files : relativeFiles})
                     })
}

module.exports = {
  findResources : configResourceList
}
