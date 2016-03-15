
const should = require('should')
const rewire = require('rewire')

const CF = rewire("../app/core/configFile.js")
const dbg = console.log
const str = JSON.stringify

describe("Config File",function() {
  describe("Set Prop",function() {
    it ("should update the given file with property value given",function() {
      const testFile = "test/data/config1.properties"
      var originalValue = ""
      var originalPropertiesCount = 0
      const original = CF.readFile(testFile)
      with(original)
      {
        should.not.be.undefined
        should.have.property("p1")
        p1.should.eql("v1")
        originalValue = p1
        originalPropertiesCount = Object.keys(original).length
      }

      CF.setProp(testFile,"p1","v1.1")

      const modified = CF.readFile(testFile)
      with(modified)
      {
       should.not.be.undefined
       should.have.property("p1")
       p1.should.eql("v1.1")
       Object.keys(modified).length.should.eql(originalPropertiesCount)
      }

      CF.setProp(testFile,"p1",originalValue)
    })

    it("should create a new property when asked to set a property that doesn't exist",function() {
      const testFile = "test/data/config1.properties"
      const original = CF.readFile(testFile)
      const newProp = "p3"
      const newVal = "v3"
      var originalPropertiesCount = 0
      with(original)
      {
        should.not.be.undefined
        should.not.have.property(newProp)
        Object.keys(original).length.should.eql(2)

        originalPropertiesCount = Object.keys(original).length
      }

      CF.setProp(testFile,newProp,newVal)

      const modified = CF.readFile(testFile)
      with (modified)
      {
        should.not.be.undefined
        should.have.property(newProp)
      }
      modified[newProp].should.eql(newVal)
      Object.keys(modified).length.should.eql(originalPropertiesCount+1)

      CF.removeProp(testFile,newProp)

    })

    it("should throw an exception when passed an empty/undefined/null filename",function() {
      [null,"",undefined].forEach(v => {
        (function() {
          CF.setProp(v)
        }).should.throw(/Invalid filename/)
      })

    })
  })
})
