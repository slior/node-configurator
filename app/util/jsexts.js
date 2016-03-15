
var dbg = console.log
var ObjectExts = {
  in : function(arr) {
    if (!arr) return false;
    for (var i = 0; i < arr.length; i++)
      if (arr[i] == this)
        return true;

    return false;
  }
}

var extend = require("node.extend")

module.exports = {
  obj : function() {
    extend(true,Object.prototype,ObjectExts)
    for (var k in ObjectExts)
      Object.defineProperty(Object.prototype,k,{
        enumerable : false
      })
  }
}
