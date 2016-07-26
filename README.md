
## Overview
A node.js based tool for browsing and updating configuration files.

The __Node-Configurator__ is a drop-in tool for managing a large collection of configuration files.
Just activate it in the root directory, and it automatically provides you an API for browsing and updating configuration anywhere in the directory below.

At this point, only a RESTful API is supported; but a command line interface + UI is on the roadmap.

## Installation

You will need node.js installed. Currently this is tested only on v4.2.3.

Clone this project, and then `npm install`

## Running
In order to run the tool in web server mode (for RESTful API and web-based UI), in the root directory of all the configuration files you want to manage just type: `node . [--root <rootdir>]`

You can also try `node . --help` for command help.

The root directory is optional, and let's you pick a specific sub directory to treat as the root. It defaults to the current working directory ('.').

### Command Line API
A command line api is also available.  
In the OS command prompt run:
```
npm run cli
```
And this will show you a prompt. Type `help` for a list of available commands.  
You can also give it a root folder, as in the web server case:
```
npm run cli -- --root <root dir>
```
where `<root dir>` is the root directory to look for configuration files. Default is the current directory the command line is running from.

The command line also supports auto-complete of file names and commands. Try pressing `<tab>`.


### Usage

#### RESTful API
At this point, there's support for RESTful CRUD API.
In your favorite REST client, try typing:
```
http://localhost:8081/config/s
```
And you should get the list of identified configuration files as a response.

A more complete API documentation is pending.

#### UI

A simple web UI, based on the RESTful API, is available at `/views/ConfigList.html`, which should provide you a simple browsing experience.
It supports listing the properties, updating (one by one or bulk), deleting properties and adding new ones.

## Adding More Configuration types
*To Complete*

## TODO

1. Command line interface
  * ~~Listing files~~
  * ~~Listing properties in a given file~~
  * ~~Reading a single property value~~
  * modifying a property
  * adding a property
  * deleting a property
2. ~~Web UI interface (simple)~~
  * ~~Displaying values~~
  * ~~Updating values~~
    * ~~Bulk updating~~
    * ~~Single property~~
  * ~~Deleting values~~
  * ~~Adding values~~
3. Support for more configuration types.
4. REST API documentation
