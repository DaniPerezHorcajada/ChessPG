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

var posiciones = [0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, "AB", 0, 0, 0, 0,
									0, 0, 0, "AB", 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0,];

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


});

server.listen(8080, function(){
	console.log("Servidor corriendo en http://localhost:8080");
})

/*


//DELETEABLE

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/database");
var userSchemaJSON = { nombre:String, direccion:Object };
var user_schema = new Schema(userSchemaJSON);
var User = mongoose.model("User",user_schema);

var msgSchema = {autor:String, texto:String};
var msg_schema = new Schema(msgSchema);
var Msg = mongoose.model("Msg", msg_schema);

*/

/*

//DELETEABLE

var mongoose = require("mongoose");
var Schema = mongoose.Schema

mongoose.connect("mongodb://192.168.12.126:8080/prueba");

var useSchemaJSON = {
	nombre:String,
	password:String
};

var user_schema = new Schema(userSchemaJSON);

var User = mongoose.model("User",user_schema);
*/



/*
//DELETEABLE

app.get('/', function(req, res){
	res.status(200).send("Hello World");
});
*/
/*
//DELETEABLE

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  //Conecction URL
var url = 'mongodb://localhost:27017/sockets';


MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	db.close();
})
*/

 //Se añadira una s (users)
/*

//EJEMPLOS

var objeto = {tel: "561651651", calle: "fghadbskjfh"};
var user1 = new User({nombre:"JOAN",direccion:objeto});
user1.save(function(err){
	console.log(err);
});

User.find({nombre:"JOAN"},function(err,user){
	console.log(user);
});

*/
