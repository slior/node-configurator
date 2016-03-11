

var fs = require('fs')
var findit = require('findit2')
require("../util/jsexts.js").obj()

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
  var extensionRE = /\.([0-9a-z]+$)/i;
  var match = extensionRE.exec(name)
  return match !== null && match[1].toLowerCase().in(configFileExtensions);
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
  console.log('cwd: ' + process.cwd())
  findConfigFiles(process.cwd() + req.app.get("root"),
                     function(files) {
                       res.json({ files : files})
                     })
}
