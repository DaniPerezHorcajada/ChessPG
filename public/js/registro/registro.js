var socket = io.connect("192.168.1.10:8080", { 'forceNew': true});

/*var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var User = require('../models/Schema').user;
var mainrutas = require('../routes/routes.main');*/

function addUser(e) {
  if (document.getElementById("password").value == document.getElementById("c_password").value){

    var payload = {
  		user: document.getElementById("usuario").value,
  		pass: document.getElementById("password").value
  	};

    socket.emit("new.user", payload);
    alert("Usuario registrado correctamente");
    return false;

  }else{
      alert("Las contraseñas no coinciden, vuelve a intentarlo");
  }
}
