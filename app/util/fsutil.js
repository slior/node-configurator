var fs = require('fs')
function isFile(name)
{
  try {
    return fs.statSync(name).isFile()
  } catch (e) {
    console.error(e)
    return false;
  } 
}

module.exports = {
  isFile : isFile
}
