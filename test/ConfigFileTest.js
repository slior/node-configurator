
const should = require('should')
const rewire = require('rewire')

const CF = rewire("../app/core/configFile.js")
const dbg = console.log
const str = JSON.stringify

const ConfigRegistry = require("../app/core/config/ConfigTypeRegistry.js")
const propsConfig = require("../app/core/config/PropertiesConfigDescriptor.js")

ConfigRegistry.register(propsConfig)


const keyCount = obj => Object.keys(obj).length

describe("Config File",function() {
  describe("Set Prop",function() {
    it ("should update the given file with property value given",function() {
      const testFile = "test/data/config1.properties"
      var originalValue = ""
      var originalPropertiesCount = 0
      const original = CF.readFile(testFile)
      dbg(original)
      with(original)
      {
        should.not.be.undefined
        should.have.property("p1")
        p1.should.eql("v1")
        originalValue = p1
        originalPropertiesCount = keyCount(original)
      }

      CF.setProp(testFile,"p1","v1.1")

      const modified = CF.readFile(testFile)
      with(modified)
      {
       should.not.be.undefined
       should.have.property("p1")
       p1.should.eql("v1.1")
       keyCount(modified).should.eql(originalPropertiesCount)
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
        keyCount(original).should.eql(2)

        originalPropertiesCount = keyCount(original)
      }

      CF.setProp(testFile,newProp,newVal)

      const modified = CF.readFile(testFile)
      with (modified)
      {
        should.not.be.undefined
        should.have.property(newProp)
      }
      modified[newProp].should.eql(newVal)
      keyCount(modified).should.eql(originalPropertiesCount+1)

      CF.removeProp(testFile,newProp)

    })

    it("should throw an exception when passed an empty/undefined/null filename",function() {
      [null,"",undefined].forEach(v => {
        (function() {
          CF.setProp(v,"p",'v')
        }).should.throw(/Invalid filename/)
      })
    })

    it ("should throw an exception when passed an empty/undefined/null property name",function() {
      [null,"",undefined].forEach(p => {
        (function() {
          CF.setProp("file1",p,"value")
        }).should.throw(/Invalid property name/)
      })
    })

    it ("should throw an exception when passed a non-existing file name", function() {
      (() => { CF.setProp("file1","p","v") }).should.throw()
    })
  })

  describe("removeProp",function() {
    const testFile = "test/data/config1.properties"
    it("should remove a property from a file where it exists",function() {
      const original = CF.readFile(testFile)
      var originalValue = ""
      with(original) {
        should.not.be.undefined
        should.have.property("p1")
        originalValue = p1
      }
      CF.removeProp(testFile,"p1")

      const modified = CF.readFile(testFile)
      with(modified) {
        modified.should.not.be.undefined
        should.not.have.property("p1")
      }
      keyCount(modified).should.eql(keyCount(original)-1)
      CF.setProp(testFile,"p1",originalValue)
    })

    it ("should complete successfully if the given property doesn't exist, without changing the file",function() {
      const original = CF.readFile(testFile)
      const NonExisting = "non-existing"
      with(original) {
        should.not.be.undefined
        should.not.have.property(NonExisting)
      }
      CF.removeProp(testFile,NonExisting)
      const modified = CF.readFile(testFile)
      modified.should.eql(original)
    })

    it("should throw an error when passed an invalid file name",function() {
      [null,"",undefined].forEach(v => {
        (function() {
          CF.removeProp(v,"p")
        }).should.throw(/Invalid filename/)
      })
    })

    it("should throw an error when passed an invalid property name",function() {
      [null,"",undefined].forEach(v => {
        (function() {
          CF.removeProp("file1",v)
        }).should.throw(/Invalid property name/)
      })
    })

    it("should throw an exception when passed a non existing file",function() {
      (() => { CF.removeProp("non existing file","p")}).should.throw()
    })
  })
})
