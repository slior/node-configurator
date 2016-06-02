"use strict"

const vorpal = require('vorpal')();

const program = require('commander')

//Setting up program arguments
program
  .version('0.0.1')
  .usage("Configurator Command Line: config files utility")
  .option('-r, --root <dir>', "Root path, relative to current working dir")
  .parse(process.argv)

const root = program.root || '.'
console.info("Root path: " + root)

//Setting up configuration types
const ConfigRegistry = require("./app/core/config/ConfigTypeRegistry.js")
const dbg = console.log

const configList = require('./app/core/configList.js')
const ConfigResource = require("./app/core/configResource.js")
const configFile = require("./app/core/configFile.js")

//Initialize the list of files
const files = []
configList.findResources(root,
                          result => result.files.forEach(filename => files.push(filename))
                        )

/// ------------- Setting up commands
vorpal
  .command('list', 'List available config files')
  .action(function(args, callback) {
    var self = this
    files.forEach(filename => self.log(filename))
    callback();
  });

vorpal
  .command('props <file>','List properties of a given file')
  .autocomplete({
    data : () => files
  })
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

// General CL configuration, and launch command line
vorpal
  .delimiter('config>>')
  .show();
