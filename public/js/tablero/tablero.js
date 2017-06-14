socket = io.connect("192.168.1.10:8080", { 'forceNew': true});

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

socket.on("ascendido_b", function(origen, x, y, wx, wy){
  piezas[origen] = "QB";
  // if (blancas[i][2] == num){
    // blancas[i][0] =
    tablero.image("../../img/QB.png", x, y, wx, wy);
  // }
});

socket.on("ascendido_n", function(origen, x, y, wx, wy){
  piezas[origen] = "QN";
  // if (negras[i][2] == num){
    // negras[i][0] =
    tablero.image("../../img/QN.png", x, y, wx, wy);
  // }
});

socket.on("0_pieza", function(data){
  pieza[data] = 0;
});
