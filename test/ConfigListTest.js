
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

  describe("configResourceList",function() {
    it("should return all config files in the test data",function() {
      configList.findResources("test",function(result) {
        result.should.have.property('files').with.lengthOf(2)
        result.files.should.matchEach(/config[1|2]\.properties/)
      })
    })
  })


})
