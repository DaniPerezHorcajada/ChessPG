var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Msg = require('../models/Schema').msg;
var User = require('../models/Schema').user;
var mainrutas = require('../routes/routes.main');
var opn = require('opn');

var jugadores = [];
var orden_jug = 0;
var turno = 0;
var nom = "";

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
	var direccion = socket.handshake;
	if (jugadores.length < 2){
		jugadores.push(direccion.address);
		orden_jug = jugadores.length-1;
		socket.emit("orden", orden_jug);
		io.sockets.emit("define_turno", turno);
		console.log("el orden es " + orden_jug);
	}
	socket.emit("definir_nombre", nom);

	socket.on('disconnect', function(){
		var direccion = socket.handshake;
		var desconexion = jugadores.indexOf(direccion.address);
		jugadores.splice(desconexion, 1);
		console.log("jugador desconectado");
		console.log(jugadores);
	});

	console.log(jugadores);
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
			if (!usuario){
				console.log("Intento fallido");
			}else{
				console.log("intento certero");
				socket.emit('redirect', "/tablero");
				res = true;
				nom = data.user;
				socket.emit("definir_nombre", nom);
			}
		});

		return res;
		//io.sockets.emit("messages", messages);
	});

	/*socket.on("ident_pos", function(data){
		io.sockets.emit("ident_loc", data);
	});*/

	socket.on("salir", function(){
		socket.emit('redirect', "/");
	});

	socket.on("fin_partida", function(fin){
		io.sockets.emit("final", fin);
	});

	socket.emit("test_de_piezas", posiciones);

	socket.on("movimiento_n", function(num, i, origen){
		io.sockets.emit("prueba_mov_n", num, i, origen);
	});

	socket.on("actualizar_tablero", function(data){
		posiciones = data;
		socket.emit("test_de_piezas", posiciones);
	});

	socket.on("movimiento_b", function(num, i, origen){
		io.sockets.emit("prueba_mov_b", num, i, origen);
	});

	socket.on("captura_b", function(i){
		io.sockets.emit("prueba_capt_b", i);
	});

	socket.on("captura_n", function(i){
		io.sockets.emit("prueba_capt_n", i);
	});

	socket.on("mover", function(num, origen){
		io.sockets.emit("movido", num, origen);
	});

	socket.on("ascenso_b", function(origen, x, y, wx, wy){
		io.sockets.emit("ascendido_b", origen, x, y, wx, wy);
	});

	socket.on("ascenso_n", function(origen, x, y, wx, wy){
		io.sockets.emit("ascendido_n", origen, x, y, wx, wy);
	});

	socket.on("fin_turno", function(){
		if (turno == 0){
			turno++;
		}else{
			turno = 0;
		}
		io.sockets.emit("define_turno", turno);
	});

	socket.on("paso_true", function(){
		io.sockets.emit("true_paso");
	});

	socket.on("paso_false", function(){
		io.sockets.emit("false_paso");
	});

	socket.on("paso_ban", function(data){
		io.sockets.emit("ban_paso", data);
	});

	socket.on("paso_nab", function(data){
		io.sockets.emit("nab_paso", data);
	});

	socket.on("pieza_0", function(data){
		io.sockets.emit("0_pieza", data);
	});
});

server.listen(8080, function(){
	console.log("Servidor corriendo en http://localhost:8080");
})
