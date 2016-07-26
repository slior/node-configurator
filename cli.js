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
/// ----- Utility functions

function doForProperty(propName,onFound,onNotAProp) {
  let resource = ConfigResource.resolve(propName)
  if (resource.type == ConfigResource.PROP_RESOURCE)
    onFound(resource)
  else
    onNotAProp()
}

function errMsg(msg) { return 'ERROR: ' + (msg ? msg : '')}
/// ------------- Setting up commands
vorpal
  .command('list', 'List available config files')
  .action(function(args, callback) {
    var self = this
    files.forEach(filename => self.log(filename))
    callback();
  });

vorpal
  .command('file <file>','List properties of a given file')
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
    else self.log(errMsg("not a file"))

    callback()
  });

vorpal
  .command('val <property>', 'Get the value of a given property')
  .autocomplete({
    data : () => files
  })
  .action(function(args,callback) {
    const self = this
    let resource = ConfigResource.resolve(args.property)
    if (resource.type == ConfigResource.PROP_RESOURCE)
    {
      try {
        let val = configFile.readProp(resource.fspath,resource.propName)
        self.log(val)
      } catch (e) {
        self.log(errMsg(((e.err && e.err == configFile.err.PROP_NOT_FOUND) ? e.description : e.toString())))
      }
    }
    else self.log(errMsg('not a property'))
    callback()
  }) //end of action

vorpal
  .command('set <property> <value>','Set the value of the given property. If a new property name is given, it is added.')
  .autocomplete({
    data : () => files
  })
  .action(function(args,callback) {
    const self = this
    doForProperty(args.property,resource => {
      try {
        configFile.setProp(resource.fspath,resource.propName,args.value)
        self.log(resource.propName + ' = ' + args.value)
      }
      catch (e) { self.log(errMsg(e.toString())) }
    }, () => self.log(errMsg('not a property')))
    callback()
  }) //end of set action

vorpal
  .command('del <property>','Delete the given property from the file')
  .autocomplete({
    data : () => files
  })
  .action(function(args,callback) {
    const self = this
    doForProperty(args.property, resource => {
      try {
        configFile.removeProp(resource.fspath,resource.propName)
        self.log('Removed: ' + resource.propName)
      }
      catch (e) { self.log(errMsg(e.toString()))}
    }, () => self.log(errMsg('not a property')))
    callback()
  }) //end of del action

// General CL configuration, and launch command line
vorpal
  .delimiter('config>>')
  .show();
