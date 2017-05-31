var socket = io.connect("192.168.12.77:8080", { 'forceNew': true});

/*var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var User = require('../models/Schema').user;
var mainrutas = require('../routes/routes.main');*/

function logear(e) {
  var payload = {
  	user: document.getElementById("usuario").value,
  	pass: document.getElementById("password").value
  };

  var test = socket.emit("logear.user", payload);
  console.log(test);
  return false;
}

socket.on('redirect', function(destination) {
    window.location.href = destination;
});
