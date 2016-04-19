var should = require('should')
var rewire = require('rewire')
const ConfigResource = rewire('../app/core/configResource.js')

describe("ConfigResource",function() {
  describe("resolve",function() {
    it("should resolve as a file a path that points to a file in the file system", function() {
      ConfigResource.__with__({
          process : { cwd : () => "." }
        , path : {
            join : (p1,p2) => p1 + "/" + p2
            , parse : (f) => {
                          return {
                            base : f.split('/')[0]
                            , dir : f.split('/')[1]
                          }
                        }
          }
        , isConfig : fname => true
      })(function() {
        var result = ConfigResource.resolve("file1")
        result.should.be.eql({
            type : ConfigResource.FILE_RESOURCE
          , path : "file1"
          , fspath : "./file1"
          , name : '.'
        })
      })
    })

    it("should resolve as a property a path to a property name whose parent is a file in the file system", function() {
      var dummyPath = ['d1','file1']
      var dummyProp = 'p1'
      ConfigResource.__with__({
          process : { cwd : () => "." }
        , path : {
            join : (p1,p2) => p1 + "/" + p2
            , parse : filename => {
              var a = filename.split("/")
              var base = a.pop()
              return {
                dir : a.join("/").replace("./",'')
                , base : base
              }
            }
          }
        , isConfig : name => name == dummyPath.join("/")
      })(function() {
        var testPath = dummyPath.join("/") + "/" + dummyProp
        var result = ConfigResource.resolve(testPath)
        result.should.be.eql({
          type : ConfigResource.PROP_RESOURCE
          , path : testPath
          , fspath : dummyPath.join("/")
          , propName : dummyProp
        })
      })
    })

    it ("should return an empty type (and object) when the resource isn't a file in the file system",function() {
      ConfigResource.__with__({
          process : { cwd : () => "." }
        , path : {
            join : (p1,p2) => p1 + "/" + p2
            , parse : filename => {
              var a = filename.split("/")
              var base = a.pop()
              return {
                dir : a.join("/").replace("./",'')
                , base : base
              }
            }
          }
        , isConfig : name => false
      })(function() {
        const result = ConfigResource.resolve("/d1/file1")
        result.should.be.eql({
          type : ""
        })
      })
    })

  })
})
