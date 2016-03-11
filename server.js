
var express = require('express')
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

//Read program inputs
function readInputs()
{

}


var port = 8081
app.set("root","/test")

var router = express.Router();

router.use((req,res,next) => {
  console.log("[REQ] " + req.method + " " + req.path);
  next();
})

router.get('/',function(req,res) {
  res.json({ message : "Configurator ON"})
})

router.get('/s',require('./app/core/configList.js'))

app.use('/config',router);

app.listen(port);
console.log("Configurator on at " + port);
