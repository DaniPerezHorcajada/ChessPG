var socket = io.connect("192.168.12.77:8080", { 'forceNew': true});

var usuario = "";

socket.on("messages", function(data){
	console.log(data);
	render(data);
});

function render(data){
	var html = data.map(function(elem, index){
		return(`<div>
					<strong>${elem.author}</strong>:
					<em>${elem.text}</em>
				</div>`);
	}).join("");

document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
	var payload = {
		author: usuario,
		text: document.getElementById("texto").value
	};

	socket.emit("new.message", payload);
	return false;
}

socket.on("definir_nombre", function(data){
	usuario = data;
	$("#username").html(data);
});
