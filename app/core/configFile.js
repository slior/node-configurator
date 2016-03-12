
module.exports = {
  /**
    Read a configuration file and return all configurations as key - value pairs in a single object.
   */
  readFile : function(filename) {
    var ret = {}
    var PropReader = require('properties-reader');
    var props = PropReader(filename)
    props.each((key,value) => {
      ret[key] = value
    })

    return ret;
  }
}
