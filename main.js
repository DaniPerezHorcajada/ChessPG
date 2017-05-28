var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Msg = require('../models/Schema').msg;
var User = require('../models/Schema').user;
var mainrutas = require('../routes/routes.main');
var opn = require('opn');

app.set("view engine", "ejs");

var messages = [{
	id: 1,
	text: "Bienvenido al chat",
	author: "Lobby"
}];

var posiciones = ["TB", "CB", "AB", "KB", "QB", "AB", "CB", "TB",
									"PB", "PB", "PB", "PB", "PB", "PB", "PB", "PB",
									0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,
									"PN", "PN", "PN", "PN", "PN", "PN", "PN", "PN",
									"TN", "CN", "AN", "KN", "QN", "AN", "CN", "TN",];

Msg.find({}, function(err, mensajes){
	mensajes.map(function(elem, index){
		messages.push({id: messages.length, text:elem.texto, author:elem.autor});
	});
});

console.log(messages);

app.use(express.static('public'));
app.use('/', mainrutas);

io.on('connection', function(socket) {
	console.log('Alguien se ha conectado con Sockets');
	console.log(socket.id);
	socket.emit("messages", messages);

	socket.on('new.message', function(data){
		messages.push(data);
		var mensaje = new Msg({autor:data.author, texto:data.text});

		mensaje.save(function(err){
			console.log(err);
		});

		io.sockets.emit("messages", messages);
	});

	socket.on('new.user', function(data){
		//messages.push(data);
		var usuario = new User({nombre:data.user, password:data.pass});

		usuario.save(function(err){
			console.log(err);
		});

		//io.sockets.emit("messages", messages);
	});

	socket.on('logear.user', function(data){
		var res = false;
		//messages.push(data);
		console.log("paso 1");
		User.findOne({nombre:data.user, password:data.pass}, function(err, usuario){
			//console.log(usuario);
			if (!usuario){
				console.log("Intento fallido");
			}else{
				console.log("intento certero");
				res = true;
			}
		});
		return res;
		//io.sockets.emit("messages", messages);
	});

	/*socket.on("ident_pos", function(data){
		io.sockets.emit("ident_loc", data);
	});*/

	socket.emit("test_de_piezas", posiciones);

	socket.on("movimiento_n", function(num, i){
		//console.log("paece qe");
		io.sockets.emit("prueba_mov_n", num, i);
	});

	socket.on("movimiento_b", function(num, i){
		//console.log("paece qe");
		io.sockets.emit("prueba_mov_b", num, i);
	});

	socket.on("captura_b", function(i){
		//console.log("paece qe");
		io.sockets.emit("prueba_capt_b", i);
	});

	socket.on("captura_n", function(i){
		//console.log("paece qe");
		io.sockets.emit("prueba_capt_n", i);
	});

});

server.listen(8080, function(){
	console.log("Servidor corriendo en http://localhost:8080");
})
