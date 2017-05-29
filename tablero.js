socket = io.connect("192.168.12.77:8080", { 'forceNew': true});

function identificar(posicion){
  socket.emit("ident_pos", posicion);
}

pieza = [];

socket.on("test_de_piezas", function(data){
  pieza = data;
});
