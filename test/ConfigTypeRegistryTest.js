
const should = require('should')
const rewire = require('rewire')
require("../app/util/jsexts.js").obj()
const ConfigRegistry = rewire('../app/core/config/ConfigTypeRegistry.js')
const ConfigDescriptor = require('../app/core/config/ConfigDescriptor.js')

describe("ConfigTypeRegistry",function() {
  describe("register",function() {
    it("Should register a new valid configuration type object when asked", function() {
      with (ConfigRegistry)
      {
        const dummy = new ConfigDescriptor("TEST",filename => true)
        register(dummy)

        const configs = configTypes().values()
        configs.length.should.eql(1)
        configs[0].should.eql(dummy)
      }
    })

    it ("should reject a config type with no type specified",function () {
      (function () {
        ConfigRegistry.register(new ConfigDescriptor(undefined,f => true))
      }).should.throw(/Invalid name for config descriptor/)
    })

    it ("should reject a config type with empty type given", function() {
      (function () {
        ConfigRegistry.register(new ConfigDescriptor("",f => true))
      }).should.throw(/Invalid name for config descriptor/)
    })

    it ("should reject a config type with invalid 'isConfigFile' given", function() {
      (function () {
        ConfigRegistry.register(new ConfigDescriptor("dummy",{}))
      }).should.throw(/Invalid isConfigFile function/)
    })

    it ("should reject an invalid config type object", function() {
      (function () {
        ConfigRegistry.register(new ConfigDescriptor("some name"))
      }).should.throw(/Invalid isConfigFile function/)
    })

  })
})
