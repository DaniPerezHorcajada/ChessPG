socket = io.connect("192.168.12.77:8080", { 'forceNew': true});

orden = "";
turno = "";
nombre = "";

socket.on("orden", function(dataa){
  orden = dataa;
});

function identificar(posicion){
  socket.emit("ident_pos", posicion);
}

pieza = [];

socket.on("test_de_piezas", function(data){
  pieza = data;
});

socket.on("define_turno", function(data){
  turno = data;
});

socket.on("definir_nombre", function(data){
  nombre = data;
});

socket.on("movido", function(num, origen){
  pieza[num] = pieza[origen];
  pieza[origen] = 0;
});
