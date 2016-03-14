
var should = require('should')

var rewire = require('rewire')
var configList = rewire('../app/core/configList.js')

describe("configList",function() {
  describe("isConfigFile",function() {
    var isConfigFile = configList.__get__('isConfigFile')
    it("should return false for filenames not ending with one of the agreed extension", function() {
      configList.__with__({
        isFile : function(name) { return name == 'some.txt' }
      })(function() {
        isConfigFile('some.txt').should.be.false
      })
    })

    it ("should return 'false' for an empty string", function() {
      configList.__with__({
        isFile : () => true
      })(function() {
        isConfigFile('').should.be.false
      })
    })
  })
})


var MockFS = {
  root : [
    "f1"
    ,"f2.config"
    , {
      d1 : [
        "f1.1"
        , "f1.2"
        , "f1.3.config"
      ]
    }
  ]
  , isFile : function(fname) { return fname && (fname.indexOf('f') >= 0); }
}
