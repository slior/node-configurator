
const dbg = console.log
const ObjectExts = {
  in : function(arr) {
    if (!arr) return false;
    for (var i = 0; i < arr.length; i++)
      if (arr[i] == this)
        return true;

    return false;
  }
  , values : function() {
    const a = []
    for (var k in this)
      a.push(this[k])
    return a;
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
