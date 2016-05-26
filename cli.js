const vorpal = require('vorpal')();

//Setting up configuration types
const ConfigRegistry = require("./app/core/config/ConfigTypeRegistry.js")
const dbg = console.log

const configList = require('./app/core/configList.js')


vorpal
  .command('list', 'List available config files')
  .action(function(args, callback) {
    var self = this
    configList.findResources('test',result => result.files.forEach(filename => self.log(filename)))
    callback();
  });

vorpal
  .delimiter('config$')
  .show();
