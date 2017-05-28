window.onload=function(){

//Asignamos el svg tablero a una variable
  var tablero = Snap("#tablero");
  var x = 0;
  var y = 0;
  var origen;

  var blancas = new Array(16);
  var negras = new Array(16);

  modo = false;
  tab = [];

  //HACER QUE TODAS LAS CASILLAS SEAN TRANSPARENTES y tengan tamaño 60x60
  function pintar_casilla(){
    for (var i = 1; i <= 64; i++){
      cas = tablero.rect(x,y,60,60);
      cas.attr({
        fill: 'transparent'
      });

      if(i%8 == 0 && i != 0){
        x = 0;
        y += 60;
      }else{
        x += 60;
      }

      tab.push(cas);
    }
  }

  //COLOCACION VISUAL INICIAL
  function colocar_inicial(){
    blancas[0] = [tablero.image("../../img/TB.png", 00, 0, 60, 60), "tb1", 0];
    blancas[1] = [tablero.image("../../img/CB.png", 60, 0, 60, 60), "cb1", 1];
    blancas[2] = [tablero.image("../../img/AB.png", 120, 0, 60, 60), "ab1", 2];
    blancas[3] = [tablero.image("../../img/KB.png", 180, 0, 60, 60), "kb", 3];
    blancas[4] = [tablero.image("../../img/QB.png", 240, 0, 60, 60), "qb", 4];
    blancas[5] = [tablero.image("../../img/AB.png", 300, 0, 60, 60), "ab2", 5];
    blancas[6] = [tablero.image("../../img/CB.png", 360, 0, 60, 60), "cb2", 6];
    blancas[7] = [tablero.image("../../img/TB.png", 420, 0, 60, 60), "tb2", 7];
    for(var i = 0; i < 8; i++){
      blancas[8+i] = [tablero.image("../../img/PB.png", i*60, 60, 60, 60), "pb"+(i+1), 8+i];
    }

    negras[0] = [tablero.image("../../img/TN.png", 00, 420, 60, 60), "tn1", 56];
    negras[1] = [tablero.image("../../img/CN.png", 60, 420, 60, 60), "cn1", 57];
    negras[2] = [tablero.image("../../img/AN.png", 120, 420, 60, 60), "an1", 58];
    negras[3] = [tablero.image("../../img/KN.png", 180, 420, 60, 60), "kn", 59];
    negras[4] = [tablero.image("../../img/QN.png", 240, 420, 60, 60), "qn", 60];
    negras[5] = [tablero.image("../../img/AN.png", 300, 420, 60, 60), "an2", 61];
    negras[6] = [tablero.image("../../img/CN.png", 360, 420, 60, 60), "cn2", 62];
    negras[7] = [tablero.image("../../img/TN.png", 420, 420, 60, 60), "tn2", 63];
    for(var i = 0; i < 8; i++){
      negras[8+i] = [tablero.image("../../img/PN.png", i*60, 360, 60, 60), "pn"+(i+1), 48+i];
    }
  }

  pintar_casilla();
  colocar_inicial();

  //EVENTO ONCLICK A FICHAS BLANCAS identifica a que ficha en concreto se ha hecho click
  for (var i = 0; i < 16; i++){
    blancas[i][0].node.onclick = function(){
      //node -> NADA QUE VER CON NODEJS --> objeto svg
      //modo false -> seleccion
      //modo true -> movimiento
      for (var j = 0; j < 16; j++){
        if (blancas[j][0].node == this){
          modo = identificar_cas(pieza, blancas[j][2], modo);
        }
      }
    };
  }

  //EVENTO ONCLICK A FICHAS NEGRAS identifica a que ficha en concreto se ha hecho click
  for (var i = 0; i < 16; i++){
    negras[i][0].node.onclick = function(){
      //node -> NADA QUE VER CON NODEJS --> objeto svg
      //modo false -> seleccion
      //modo true -> movimiento
      for (var j = 0; j < 16; j++){
        if (negras[j][0].node == this){
          modo = identificar_cas(pieza, negras[j][2], modo);
        }
      }
    };
  }

  //IDENTIFICA LA CASILLA CLICKADA y actua en consecuencia
  function identificar_cas(piezas, num, modo){
    if (modo == false){//no se ha seleccionado ninguna pieza
      if (piezas[num] == 0){//casilla seleccionada vacia
        alert("Casilla vacía, selecciona otra");
      }else{
        origen = num;
        movimiento_pieza(piezas, num);//mostrar movimientos disponibles
        return true;
      }
    }else{//pieza seleccionada dispuesta al movimiento
      if (piezas[num] == 0){//casilla destino vacia
        piezas[num] = piezas[origen];
        piezas[origen] = 0;
        for(var i = 0; i < 16; i++){//movimiento visual blancas
          if (blancas[i][2] == origen){
            blancas[i][2] = num;
          socket.emit("movimiento_b", num, i);
          }
        }
        for(var i = 0; i < 16; i++){//movimiento visual negras
          if (negras[i][2] == origen){
            negras[i][2] = num;
          socket.emit("movimiento_n", num, i);
          }
        }
        return false;
      }else{//casilla destino ocupada por otra pieza
        if ((piezas[origen] == "PB" || piezas[origen] == "CB" || piezas[origen] == "AB" ||
        piezas[origen] == "TB" || piezas[origen] == "QB" || piezas[origen] == "KB") &&
        (piezas[num] == "PN" || piezas[num] == "CN" || piezas[num] == "AN" ||
        piezas[num] == "TN" || piezas[num] == "QN" || piezas[num] == "KN")){
          piezas[num] = piezas[origen];
          piezas[origen] = 0;
          for(var i = 0; i < 16; i++){//localizar y eliminar pieza negra del tablero
            if (negras[i][2] == num){
              socket.emit("captura_n", i);
              negras[i][2] = null;
            }
          }
          for(var i = 0; i < 16; i++){//movimiento visual blancas
            if (blancas[i][2] == origen){
              blancas[i][2] = num;
            socket.emit("movimiento_b", num, i);
            }
          }
        }else
        if ((piezas[origen] == "PN" || piezas[origen] == "CN" || piezas[origen] == "AN" ||
        piezas[origen] == "TN" || piezas[origen] == "QN" || piezas[origen] == "KN") &&
        (piezas[num] == "PB" || piezas[num] == "CB" || piezas[num] == "AB" ||
        piezas[num] == "TB" || piezas[num] == "QB" || piezas[num] == "KB")){
          piezas[num] = piezas[origen];
          piezas[origen] = 0;
          for(var i = 0; i < 16; i++){//localizar y eliminar pieza blanca del tablero
            if (blancas[i][2] == num){
              socket.emit("captura_b", i);
              blancas[i][2] = null;
            }
          }
          for(var i = 0; i < 16; i++){//movimiento visual blancas
            if (negras[i][2] == origen){
              negras[i][2] = num;
            socket.emit("movimiento_n", num, i);
            }
          }
        }else{
          origen = num;
          limpiar_tablero();
          movimiento_pieza(piezas, num);
        }
      }
    }
  }

  //MOVIMIENTO VISUAL NEGRO
  socket.on("prueba_mov_n", function(num, i){
    limpiar_tablero();
    negras[i][0].animate({
      x:(num%8)*60,
      y:(Math.trunc(num/8))*60
    }, 1000);
  });

  //MOVIMIENTO VISUAL BLANCO
  socket.on("prueba_mov_b", function(num, i){
    limpiar_tablero();
    blancas[i][0].animate({
      x:(num%8)*60,
      y:(Math.trunc(num/8))*60
    }, 1000);
  });

  //FICHA BLANCA CAPTURADA
  socket.on("prueba_capt_b", function(i){
    limpiar_tablero();
    blancas[i][0].animate({
      x:1000,
      y:1000
    }, 500);
  });

  //FICHA NEGRA CAPTURADA
  socket.on("prueba_capt_n", function(i){
    limpiar_tablero();
    negras[i][0].animate({
      x:1000,
      y:1000
    }, 500);
  });

  //LIMPIAR LAS CASILAS DE COLOR ROJO
  function limpiar_tablero(){
    for (var i = 0; i <= 63; i++){
      tab[i].attr({
        fill: 'transparent'
      });
    }
  }


  //MUESTRA DE MOVIMIENTOS LEGALES DISPONIBLES SEGUN LA FICHA
  function movimiento_pieza(tipo, num){
    if (tipo[num] == "PB"){
      if((tipo[num+8] == 0 || tipo[num+8] == "PN" || tipo[num+8] == "CN" || tipo[num+8] == "TN" || tipo[num+8] == "AN" ||
      tipo[num+8] == "QN" || tipo[num+8] == "KN") && num+8 < 64){
        tab[num+8].attr({
          fill: 'red'
        });
        if (num > 7 && num < 16 && ((tipo[num+16] == 0 || tipo[num+16] == "PN" || tipo[num+16] == "CN" || tipo[num+16] == "TN" || tipo[num+16] == "AN" ||
        tipo[num+16] == "QN" || tipo[num+16] == "KN") && num+16 < 64)){
          tab[num+16].attr({
            fill: 'red'
          });
        }
      }else{
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "PN"){
      if((tipo[num-8] == 0 || tipo[num-8] == "PB" || tipo[num-8] == "CB" || tipo[num-8] == "TB" || tipo[num-8] == "AB" ||
       tipo[num-8] == "QB" || tipo[num-8] == "KB")  && num-8 >= 0){
        tab[num-8].attr({
          fill: 'red'
        });
        if (num > 47 && num < 56 && ((tipo[num-16] == 0 || tipo[num-16] == "PB" || tipo[num-16] == "CB" || tipo[num-16] == "TB" || tipo[num-16] == "AB" ||
        tipo[num-16] == "QB" || tipo[num-16] == "KB") && num-16 >= 0)){
          tab[num-16].attr({
            fill: 'red'
          });
        }
      }else{
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "CB"){
      if (num%8 == 0){
        var pos_cas = 0;
        if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+10] == 0 && num+10 < 64 && num+10 >= 0){
          tab[num+10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-6] == 0 && num-6 < 64 && num-6 >= 0){
          tab[num-6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }else
      if (num%8 == 1){
        var pos_cas = 0;
        if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+10] == 0 && num+10 < 64 && num+10 >= 0){
          tab[num+10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-6] == 0 && num-6 < 64 && num-6 >= 0){
          tab[num-6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }else
      if (num%8 == 6){
        var pos_cas = 0;
        if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-10] == 0 && num-10 < 64 && num-10 >= 0){
          tab[num-10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+6] == 0 && num+6 < 64 && num+6 >= 0){
          tab[num+6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }else
      if (num%8 == 7){
        var pos_cas = 0;
        if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-10] == 0 && num-10 < 64 && num-10 >= 0){
          tab[num-10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+6] == 0 && num+6 < 64 && num+6 >= 0){
          tab[num+6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }
      else{
        var pos_cas = 0;
        if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
            tab[num+17].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
            tab[num+15].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
            tab[num-17].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
            tab[num-15].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(tipo[num+10] == 0 && num+10 < 64 && num+10 >= 0){
            tab[num+10].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(tipo[num-6] == 0 && num-6 < 64 && num-6 >= 0){
            tab[num-6].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(tipo[num-10] == 0 && num-10 < 64 && num-10 >= 0){
            tab[num-10].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(tipo[num+6] == 0 && num+6 < 64 && num+6 >= 0){
            tab[num+6].attr({
              fill: 'red'
            });
            pos_cas++;
          }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }
    }else
    if (tipo[num] == "CN"){
      if (num%8 == 0){
        var pos_cas = 0;
        if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+10] == 0 && num+10 < 64 && num+10 >= 0){
          tab[num+10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-6] == 0 && num-6 < 64 && num-6 >= 0){
          tab[num-6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }else
      if (num%8 == 1){
        var pos_cas = 0;
        if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+10] == 0 && num+10 < 64 && num+10 >= 0){
          tab[num+10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-6] == 0 && num-6 < 64 && num-6 >= 0){
          tab[num-6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }else
      if (num%8 == 6){
        var pos_cas = 0;
        if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-10] == 0 && num-10 < 64 && num-10 >= 0){
          tab[num-10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+6] == 0 && num+6 < 64 && num+6 >= 0){
          tab[num+6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }else
      if (num%8 == 7){
        var pos_cas = 0;
        if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num-10] == 0 && num-10 < 64 && num-10 >= 0){
          tab[num-10].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(tipo[num+6] == 0 && num+6 < 64 && num+6 >= 0){
          tab[num+6].attr({
            fill: 'red'
          });
          pos_cas++;
        }
        if(pos_cas == 0){
          alert("ningún movimiento es posible");
        }
      }
      else{
          var pos_cas = 0;
          if(tipo[num+17] == 0 && num+17 < 64 && num+17 >= 0){
            tab[num+17].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(tipo[num+15] == 0 && num+15 < 64 && num+15 >= 0){
            tab[num+15].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(tipo[num-17] == 0 && num-17 < 64 && num-17 >= 0){
            tab[num-17].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(tipo[num-15] == 0 && num-15 < 64 && num-15 >= 0){
            tab[num-15].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(tipo[num+10] == 0 && num+10 < 64 && num+10 >= 0){
            tab[num+10].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(tipo[num-6] == 0 && num-6 < 64 && num-6 >= 0){
            tab[num-6].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(tipo[num-10] == 0 && num-10 < 64 && num-10 >= 0){
            tab[num-10].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(tipo[num+6] == 0 && num+6 < 64 && num+6 >= 0){
            tab[num+6].attr({
              fill: 'red'
            });
            pos_cas++;
          }
          if(pos_cas == 0){
            alert("ningún movimiento es posible");
          }
      }
    }else
    if (tipo[num] == "KB"){
      var pos_cas = 0;
      if(tipo[num+8] == 0 && num+8 < 64 && num+8 >= 0){
        tab[num+8].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num+1] == 0 && num+1 < 64 && num+1 >= 0){
        tab[num+1].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-8] == 0 && num-8 < 64 && num-8 >= 0){
        tab[num-8].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-1] == 0 && num-1 < 64 && num-1 >= 0){
        tab[num-1].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num+9] == 0 && num+9 < 64 && num+9 >= 0){
        tab[num+9].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-7] == 0 && num-7 < 64 && num-7 >= 0){
        tab[num-7].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-9] == 0 && num-9 < 64 && num-9 >= 0){
        tab[num-9].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num+7] == 0 && num+7 < 64 && num+7 >= 0){
        tab[num+7].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "KN"){
      var pos_cas = 0;
      if(tipo[num+8] == 0 && num+8 < 64 && num+8 >= 0){
        tab[num+8].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num+1] == 0 && num+1 < 64 && num+1 >= 0){
        tab[num+1].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-8] == 0 && num-8 < 64 && num-8 >= 0){
        tab[num-8].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-1] == 0 && num-1 < 64 && num-1 >= 0){
        tab[num-1].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num+9] == 0 && num+9 < 64 && num+9 >= 0){
        tab[num+9].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-7] == 0 && num-7 < 64 && num-7 >= 0){
        tab[num-7].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num-9] == 0 && num-9 < 64 && num-9 >= 0){
        tab[num-9].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(tipo[num+7] == 0 && num+7 < 64 && num+7 >= 0){
        tab[num+7].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "TB"){
      var pos_cas = 0;
      for(var i = 8; num+i < 64 && tipo[num+i] == 0; i += 8){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 8; num-i >= 0 && tipo[num-i] == 0; i += 8){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num+i)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num-i+1)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "TN"){
      var pos_cas = 0;
      for(var i = 8; num+i < 64 && tipo[num+i] == 0; i += 8){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 8; num-i >= 0 && tipo[num-i] == 0; i += 8){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num+i)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num-i+1)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "AB"){
      var pos_cas = 0;
      for(var i = 9; num+i < 64 && (num+i)%8 != 0 && tipo[num+i] == 0; i += 9){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && tipo[num+i] == 0; i += 7){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && tipo[num-i] == 0; i += 9){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && tipo[num-i] == 0; i += 7){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "AN"){
      var pos_cas = 0;
      for(var i = 9; num+i < 64 && (num+i)%8 != 0 && tipo[num+i] == 0; i += 9){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && tipo[num+i] == 0; i += 7){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && tipo[num-i] == 0; i += 9){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && tipo[num-i] == 0; i += 7){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "QB"){
      var pos_cas = 0;
      for(var i = 8; num+i < 64 && tipo[num+i] == 0; i += 8){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 8; num-i >= 0 && tipo[num-i] == 0; i += 8){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num+i)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num-i+1)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 9; num+i < 64 && (num+i)%8 != 0 && tipo[num+i] == 0; i += 9){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && tipo[num+i] == 0; i += 7){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && tipo[num-i] == 0; i += 9){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && tipo[num-i] == 0; i += 7){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "QN"){
      var pos_cas = 0;
      for(var i = 8; num+i < 64 && tipo[num+i] == 0; i += 8){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 8; num-i >= 0 && tipo[num-i] == 0; i += 8){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num+i)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 1; (num-i+1)%8 != 0 && tipo[num+i] == 0; i++){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 9; num+i < 64 && (num+i)%8 != 0 && tipo[num+i] == 0; i += 9){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && tipo[num+i] == 0; i += 7){
        tab[num+i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && tipo[num-i] == 0; i += 9){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && tipo[num-i] == 0; i += 7){
        tab[num-i].attr({
          fill: 'red'
        });
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else{
      alert("NANI?!");
    }
  }

  //EVENTO ONCLICK EN CASILLA VACIA
  for (var i = 0; i < 64; i++){
      tab[i].node.onclick = function(){
        //modo false -> seleccion
        //modo true -> movimiento
        for (var j = 0; j < 64; j++){
          if (tab[j].node == this){
            modo = identificar_cas(pieza, j, modo);
          }
        }
      };
    }

}
/*generando una variable sin "var" creamos una variable que se puede usar en
cualquier .js (main.js, tablero.js....) que se referencie en el .ejs
parametros: pos_x, pos_y, width, height
cas = tablero.rect(0,0,200,400);

Con el 'this', seleccoionamos el objeto casilla

2 arrays: 1o guardar objetos casilla (unidimensional)
2o unidimensional estado casilla (vacio, ficha_blanca, ficha_negra)

*/
