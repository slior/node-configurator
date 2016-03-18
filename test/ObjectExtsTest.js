
require("../app/util/jsexts.js").obj()
var should = require("should")

describe("Object Extensions",function() {
  describe("in",function() {
    it("should return true when the value is in the given array",function() {
      "123".in(["123","456"]).should.be.true
    })

    it("should return false when the value is not in the array",function() {
      "a".in(["b","c"]).should.be.false
    })

    it("should return false on an empty array",function() {
      "".in([]).should.be.false
    })

    it("should return false when null and undefined are passed to it",function() {
      "aaa".in(null).should.be.false
      "bbb".in(undefined).should.be.false
    })
  })

  describe("values",function() {
    it ("should return all values for a simple object", function() {
      const obj = { a: 1, b : "2"}
      obj.values().should.eql([1,"2"])
    })
  })
})
