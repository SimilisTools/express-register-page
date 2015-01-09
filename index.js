var express=require('express');
var nconfig = require('./config.js');
var config = nconfig.get("express");
var errorhandler = require("errorhandler");
var bodyParser = require('body-parser');
var compression = require('compression');
var nodemailer = require("nodemailer");

var lessMiddleware = require('less-middleware');

var basepath = "";

if (config.basepath) {
	basepath = config.basepath;
}

var app=express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Config
app.use(errorhandler({ dumpExceptions: true, showStack: true }));

// Compression
app.use(compression({
  threshold: 512
}))

app.set("config", config);

// Launch server
var server = app.listen(config.port);

var register = require('./routes/register.js');
var verify = require('./routes/verify.js');
var list = require('./routes/list.js');
var remove = require('./routes/remove.js');


// Now views
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(lessMiddleware(__dirname + '/public')); // TODO: Minor, allow other paths
app.use(basepath, express.static(__dirname + '/public'))

// Landing
app.get( basepath + '/', function(req, res){
	res.render('index.html', { basepath: basepath } );
})

// Register address
app.post(basepath + '/register', register.registerAddress);
// Verify address
// app.get(basepath + '/verify', verify.verifyAddress);
// List addresses
app.get(basepath + '/list', list.listAddresses);
// Remove address
// app.post(basepath + '/remove', remove.removeAddress);

console.log("Seqserver listening on port " + config.port);