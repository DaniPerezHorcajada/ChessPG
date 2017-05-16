var express = require('express');
var router = express.Router();
var server = require('http').Server(express());
var io = require('socket.io')(server);

router.get('/', function(req, res){
	var ip = req.headers['x-forwarded-for'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;
	console.log(ip);
	res.render("pages/index");
});

router.get('/chat', function(req, res){
	res.render("pages/chat");
});

router.get('/registro', function(req, res){
	res.render("pages/registro");
});

router.get('/login', function(req, res){
	res.render("pages/login");
});

router.get('/tablero', function(req, res){
	res.render("pages/tablero");
});

module.exports = router;
