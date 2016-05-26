"use strict"

const vorpal = require('vorpal')();

//Setting up configuration types
const ConfigRegistry = require("./app/core/config/ConfigTypeRegistry.js")
const dbg = console.log

const configList = require('./app/core/configList.js')
const ConfigResource = require("./app/core/configResource.js")
const configFile = require("./app/core/configFile.js")

vorpal
  .command('list', 'List available config files')
  .action(function(args, callback) {
    var self = this
    configList.findResources('test',result => result.files.forEach(filename => self.log(filename)))
    callback();
  });

vorpal
  .command('props <file>','List properties of a given file')
  .action(function(args,callback) {
    var self = this
    let CR = ConfigResource
    let resource = CR.resolve(args.file)
    if (resource.type == CR.FILE_RESOURCE)
    {
      let props = configFile.readFile(resource.fspath)
      Object.keys(props)
            .map(name => name + " = " + props[name])
            .forEach(o => self.log(o))
    }
    else self.log("ERROR: not a file")

    callback()
  });

vorpal
  .delimiter('config>>')
  .show();
