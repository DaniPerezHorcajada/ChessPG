socket = io.connect("localhost:8080", { 'forceNew': true});

function identificar(posicion){
  //alert(posicion + "local");
  socket.emit("ident_pos", posicion);
}

/*socket.on("ident_loc", function(data){
  alert(data + "cliente");
});*/

pieza = [];

socket.on("test_de_piezas", function(data){
  pieza = data;
});
