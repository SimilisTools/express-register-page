var express=require('express');
var nconfig = require('./config.js');
var config = nconfig.get("express");
var errorhandler = require("errorhandler");
var bodyParser = require('body-parser');
var compression = require('compression');

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
var remove = require('./routes/remove.js');
var list = require('./routes/list.js');

// Now views
app.set('views', __dirname + '/views');
app.set('mail', __dirname + '/mail');

app.engine('html', require('ejs').renderFile);

app.use(lessMiddleware(__dirname + '/public')); // TODO: Minor, allow other paths
app.use(basepath, express.static(__dirname + '/public'))

// Landing
app.get( basepath + '/', function(req, res){
	var params = {};
	params.event = config.event;
	params.basepath = basepath;
	params.contact = config.contact;
	res.render('index.html', params );
})

// Register address
app.post(basepath + '/register', register.registerAddress);
// Verify address for registering
app.get(basepath + '/register/:email/:strid', register.verifyAddress);

// Remove address
app.post(basepath + '/remove', remove.removeAddress);
// Verify address for removing
app.get(basepath + '/remove/:email/:rmvid', remove.verifyAddress);

// List addresses
app.get(basepath + '/list', list.listAddresses);

console.log("Seqserver listening on port " + config.port);
