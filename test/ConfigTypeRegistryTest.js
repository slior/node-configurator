
const should = require('should')
const rewire = require('rewire')
require("../app/util/jsexts.js").obj()
const ConfigRegistry = rewire('../app/core/config/ConfigTypeRegistry.js')

describe("ConfigTypeRegistry",function() {
  describe("register",function() {
    it("Should register a new valid configuration type object when asked", function() {
      with (ConfigRegistry)
      {
        const dummy = {
            type : "TEST"
            , isConfigFile : filename => true
        }
        register(dummy)

        const configs = configTypes().values()
        configs.length.should.eql(1)
        configs[0].should.eql(dummy)
      }
    })

    it ("should reject a config type with no type specified",function () {
      (function () {
        ConfigRegistry.register({
          isConfigFile : f => true
        })
      }).should.throw(/Invalid configuration type descriptor/)
    })

    it ("should reject a config type with empty type given", function() {
      (function () {
        ConfigRegistry.register({
          type : "",
          isConfigFile : f => true
        })
      }).should.throw(/Invalid configuration type descriptor/)
    })

    it ("should reject a config type with invalid 'isConfigFile' given", function() {
      (function () {
        ConfigRegistry.register({
          type : "dummy",
          isConfigFile : {}
        })
      }).should.throw(/Invalid configuration type descriptor/)
    })

    it ("should reject an invalid config type object", function() {
      (function () {
        ConfigRegistry.register("some string")
      }).should.throw(/Invalid configuration type descriptor/)
    })

  })
})
