

var fs = require('fs')
var findit = require('findit2')
require("../util/jsexts.js").obj()
var path = require('path')

var str = JSON.stringify
var dbg = console.log

var configFileExtensions = ['properties','config','cfg']
function isFile(name)
{
  return fs.statSync(name).isFile()
}

function isConfigFile(name)
{
  if (!isFile(name)) return false;
  var ext = path.extname(name).replace('.','')
  return ext.in(configFileExtensions)
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

module.exports = function(req,res) {
  var basePath = path.join(process.cwd(),req.app.get('root'))
  dbg('base path: ' + basePath)
  findConfigFiles(basePath,
                     function(files) {
                       var relativeFiles = files.map(f => f.replace(basePath.replace('/','\\'),''))
                       res.json({ files : relativeFiles})
                     })
}
