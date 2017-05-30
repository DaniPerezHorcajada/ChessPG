window.onload=function(){

//Asignamos el svg tablero a una variable
  var tablero = Snap("#tablero");
  var x = 0;
  var y = 0;
  var origen;
  var movimientos = [];

  var blancas = new Array(16);
  var negras = new Array(16);

  modo = false;
  tab = [];

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

  for (var i = 0; i < 16; i++){//cuando clickamos blancas
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

  for (var i = 0; i < 16; i++){//cuando clickamos negras
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

  function identificar_cas(piezas, num, modo){
    if (modo == false){//no se ha seleccionado ninguna pieza
      if (piezas[num] == 0){//casilla seleccionada vacia
        alert("Casilla vacía, selecciona otra");
      }else{
        origen = num;
        movimiento_pieza(piezas, num);//mostrar movimientos disponibles
        // if (hay_mov == true){
        //   return true;
        // }else{
        //   alert("No hay movimientos disponibles");
        //   alert("1");
        //   return false;
        // }
      }
    }else{//pieza seleccionada dispuesta al movimiento
      if (piezas[num] == 0){//casilla destino vacia
        limpiar_tablero();
        if (comprobar_movimiento(num) == true){
          movimientos = [];
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
          //socket.emit('fin_turno');
        }else{
          alert("Movimiento ilegal");
        }
        return false;
      }else{//casilla destino ocupada
        if ((piezas[origen] == "PN" || piezas[origen] == "CN" || piezas[origen] == "AN" ||
        piezas[origen] == "TN" || piezas[origen] == "QN" || piezas[origen] == "KN") &&
        (piezas[num] == "PB" || piezas[num] == "CB" || piezas[num] == "AB" ||
        piezas[num] == "TB" || piezas[num] == "QB" || piezas[num] == "KB")){
          if (comprobar_movimiento(num) == true){
            movimientos = [];
            piezas[num] = piezas[origen];
            piezas[origen] = 0;
            for(var i = 0; i < 16; i++){//localizar y eliminar pieza negra del tablero
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
            //socket.emit('fin_turno');
          }else{
            alert("Movimiento ilegal");
          }
          return false;
        }else
        if ((piezas[origen] == "PB" || piezas[origen] == "CB" || piezas[origen] == "AB" ||
        piezas[origen] == "TB" || piezas[origen] == "QB" || piezas[origen] == "KB") &&
        (piezas[num] == "PN" || piezas[num] == "CN" || piezas[num] == "AN" ||
        piezas[num] == "TN" || piezas[num] == "QN" || piezas[num] == "KN")){
          if (comprobar_movimiento(num) == true){
            movimientos = [];
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
            //socket.emit('fin_turno');
          }else{
            alert("Movimiento ilegal");
          }
          return false;
        }else{
          movimientos = [];
          origen = num;
          limpiar_tablero();
          movimiento_pieza(piezas, num);
          // if (hay_mov == true){
          //   return true;
          // }else{
          //   alert("No hay movimientos disponibles");
          //   alert("2");
          //   return false;
          // }
        }
      }
    }
  }

  socket.on("prueba_mov_n", function(num, i){
    negras[i][0].animate({
      x:(num%8)*60,
      y:(Math.trunc(num/8))*60
    }, 1000);
  });

  socket.on("prueba_mov_b", function(num, i){
    blancas[i][0].animate({
      x:(num%8)*60,
      y:(Math.trunc(num/8))*60
    }, 1000);
  });

  socket.on("prueba_capt_b", function(i){
    limpiar_tablero();
    blancas[i][0].animate({
      x:1000,
      y:1000
    }, 500);
  });

  socket.on("prueba_capt_n", function(i){
    limpiar_tablero();
    negras[i][0].animate({
      x:1000,
      y:1000
    }, 500);
  });

  function movimiento_pieza(tipo, num){
    if (tipo[num] == "PB"){
      movimiento_pb(tipo,num);
    }else
    if (tipo[num] == "PN"){
      movimiento_pn(tipo,num);
    }else
    if (tipo[num] == "CB"){
      movimiento_cb(tipo,num);
    }else
    if (tipo[num] == "CN"){
      movimiento_cn(tipo,num);
    }else
    if (tipo[num] == "KB"){
      movimiento_kb(tipo,num);
    }else
    if (tipo[num] == "KN"){
      movimiento_kn(tipo,num);
    }else
    if (tipo[num] == "TB"){
      movimiento_tb(tipo,num);
    }else
    if (tipo[num] == "TN"){
      movimiento_tn(tipo,num);
    }else
    if (tipo[num] == "AB"){
      movimiento_ab(tipo,num);
    }else
    if (tipo[num] == "AN"){
      movimiento_an(tipo,num);
    }else
    if (tipo[num] == "QB"){
      movimiento_qb(tipo,num);
    }else
    if (tipo[num] == "QN"){
      movimiento_qn(tipo,num);
    }else{
      alert("Pieza y/o movimiento no identificado");
    }
  }

  function movimiento_pb(tipo,num){
    var cont_mov = 0;
    if(tipo[num+8] == 0 && num+8 < 64){
      tab[num+8].attr({
        fill: 'red'
      });
      movimientos.push(num+8);
      cont_mov++;
      if (num > 7 && num < 16 && (tipo[num+16] == 0 && num+16 < 64)){
        tab[num+16].attr({
          fill: 'red'
        });
        movimientos.push(num+16);
        cont_mov++;
      }
    }
    if((tipo[num+9] == "PN" || tipo[num+9] == "CN" || tipo[num+9] == "TN" || tipo[num+9] == "AN" ||
    tipo[num+9] == "QN" || tipo[num+9] == "KN") && num+9 < 64){
      tab[num+9].attr({
        fill: 'red'
      });
      movimientos.push(num+9);
      cont_mov++;
    }
    if((tipo[num+7] == "PN" || tipo[num+7] == "CN" || tipo[num+7] == "TN" || tipo[num+7] == "AN" ||
    tipo[num+7] == "QN" || tipo[num+7] == "KN") && num+7 < 64){
      tab[num+7].attr({
        fill: 'red'
      });
      movimientos.push(num+7);
      cont_mov++;
    }
    if(cont_mov == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }

  function movimiento_pn(tipo,num){
    var cont_mov = 0;
    if(tipo[num-8] == 0  && num-8 >= 0){
      tab[num-8].attr({
        fill: 'red'
      });
      movimientos.push(num-8);
      cont_mov++;
      if (num > 47 && num < 56 && (tipo[num-16] == 0 && num-16 >= 0)){
        tab[num-16].attr({
          fill: 'red'
        });
        movimientos.push(num-16);
        cont_mov++;
      }
    }
    if((tipo[num-9] == "PB" || tipo[num-9] == "CB" || tipo[num-9] == "TB" || tipo[num-9] == "AB" ||
    tipo[num-9] == "QB" || tipo[num-9] == "KB")  && num-9 >= 0){
      tab[num-9].attr({
        fill: 'red'
      });
      movimientos.push(num-9);
      cont_mov++;
    }
    if((tipo[num-7] == "PB" || tipo[num-7] == "CB" || tipo[num-7] == "TB" || tipo[num-7] == "AB" ||
    tipo[num-7] == "QB" || tipo[num-7] == "KB")  && num-7 >= 0){
      tab[num-7].attr({
        fill: 'red'
      });
      movimientos.push(num-7);
      cont_mov++;
    }
    if(cont_mov == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }

  function movimiento_cb(tipo,num){
    if (num%8 == 0){
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PN" || tipo[num+17] == "CN" || tipo[num+17] == "TN" || tipo[num+17] == "AN" ||
      tipo[num+17] == "QN" || tipo[num+17] == "KN") && num+17 < 64 && num+17 >= 0){
        tab[num+17].attr({
          fill: 'red'
        });
        movimientos.push(num+17);
        pos_cas++;
      }
      if((tipo[num-15] == 0 || tipo[num-15] == "PN" || tipo[num-15] == "CN" || tipo[num-15] == "TN" || tipo[num-15] == "AN" ||
      tipo[num-15] == "QN" || tipo[num-15] == "KN") && num-15 < 64 && num-15 >= 0){
        tab[num-15].attr({
          fill: 'red'
        });
        movimientos.push(num-15);
        pos_cas++;
      }
      if((tipo[num+10] == 0 || tipo[num+10] == "PN" || tipo[num+10] == "CN" || tipo[num+10] == "TN" || tipo[num+10] == "AN" ||
      tipo[num+10] == "QN" || tipo[num+10] == "KN") && num+10 < 64 && num+10 >= 0){
        tab[num+10].attr({
          fill: 'red'
        });
        movimientos.push(num+10);
        pos_cas++;
      }
      if((tipo[num-6] == 0 || tipo[num-6] == "PN" || tipo[num-6] == "CN" || tipo[num-6] == "TN" || tipo[num-6] == "AN" ||
      tipo[num-6] == "QN" || tipo[num-6] == "KN") && num-6 < 64 && num-6 >= 0){
        tab[num-6].attr({
          fill: 'red'
        });
        movimientos.push(num-6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (num%8 == 1){
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PN" || tipo[num+17] == "CN" || tipo[num+17] == "TN" || tipo[num+17] == "AN" ||
      tipo[num+17] == "QN" || tipo[num+17] == "KN") && num+17 < 64 && num+17 >= 0){
        tab[num+17].attr({
          fill: 'red'
        });
        movimientos.push(num+17);
        pos_cas++;
      }
      if((tipo[num+15] == 0 || tipo[num+15] == "PN" || tipo[num+15] == "CN" || tipo[num+15] == "TN" || tipo[num+15] == "AN" ||
      tipo[num+15] == "QN" || tipo[num+15] == "KN") && num+15 < 64 && num+15 >= 0){
        tab[num+15].attr({
          fill: 'red'
        });
        movimientos.push(num+15);
        pos_cas++;
      }
      if((tipo[num-17] == 0 || tipo[num-17] == "PN" || tipo[num-17] == "CN" || tipo[num-17] == "TN" || tipo[num-17] == "AN" ||
      tipo[num-17] == "QN" || tipo[num-17] == "KN") && num-17 < 64 && num-17 >= 0){
        tab[num-17].attr({
          fill: 'red'
        });
        movimientos.push(num-17);
        pos_cas++;
      }
      if((tipo[num-15] == 0 || tipo[num-15] == "PN" || tipo[num-15] == "CN" || tipo[num-15] == "TN" || tipo[num-15] == "AN" ||
      tipo[num-15] == "QN" || tipo[num-15] == "KN") && num-15 < 64 && num-15 >= 0){
        tab[num-15].attr({
          fill: 'red'
        });
        movimientos.push(num-15);
        pos_cas++;
      }
      if((tipo[num+10] == 0 || tipo[num+10] == "PN" || tipo[num+10] == "CN" || tipo[num+10] == "TN" || tipo[num+10] == "AN" ||
      tipo[num+10] == "QN" || tipo[num+10] == "KN") && num+10 < 64 && num+10 >= 0){
        tab[num+10].attr({
          fill: 'red'
        });
        movimientos.push(num+10);
        pos_cas++;
      }
      if((tipo[num-6] == 0 || tipo[num-6] == "PN" || tipo[num-6] == "CN" || tipo[num-6] == "TN" || tipo[num-6] == "AN" ||
      tipo[num-6] == "QN" || tipo[num-6] == "KN") && num-6 < 64 && num-6 >= 0){
        tab[num-6].attr({
          fill: 'red'
        });
        movimientos.push(num-6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (num%8 == 6){
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PN" || tipo[num+17] == "CN" || tipo[num+17] == "TN" || tipo[num+17] == "AN" ||
      tipo[num+17] == "QN" || tipo[num+17] == "KN") && num+17 < 64 && num+17 >= 0){
        tab[num+17].attr({
          fill: 'red'
        });
        movimientos.push(num+17);
        pos_cas++;
      }
      if((tipo[num+15] == 0 || tipo[num+15] == "PN" || tipo[num+15] == "CN" || tipo[num+15] == "TN" || tipo[num+15] == "AN" ||
      tipo[num+15] == "QN" || tipo[num+15] == "KN") && num+15 < 64 && num+15 >= 0){
        tab[num+15].attr({
          fill: 'red'
        });
        movimientos.push(num+15);
        pos_cas++;
      }
      if((tipo[num-17] == 0 || tipo[num-17] == "PN" || tipo[num-17] == "CN" || tipo[num-17] == "TN" || tipo[num-17] == "AN" ||
      tipo[num-17] == "QN" || tipo[num-17] == "KN") && num-17 < 64 && num-17 >= 0){
        tab[num-17].attr({
          fill: 'red'
        });
        movimientos.push(num-17);
        pos_cas++;
      }
      if((tipo[num-15] == 0 || tipo[num-15] == "PN" || tipo[num-15] == "CN" || tipo[num-15] == "TN" || tipo[num-15] == "AN" ||
      tipo[num-15] == "QN" || tipo[num-15] == "KN") && num-15 < 64 && num-15 >= 0){
        tab[num-15].attr({
          fill: 'red'
        });
        movimientos.push(num-15);
        pos_cas++;
      }
      if((tipo[num-10] == 0 || tipo[num-10] == "PN" || tipo[num-10] == "CN" || tipo[num-10] == "TN" || tipo[num-10] == "AN" ||
      tipo[num-10] == "QN" || tipo[num-10] == "KN") && num-10 < 64 && num-10 >= 0){
        tab[num-10].attr({
          fill: 'red'
        });
        movimientos.push(num-10);
        pos_cas++;
      }
      if((tipo[num+6] == 0 || tipo[num+6] == "PN" || tipo[num+6] == "CN" || tipo[num+6] == "TN" || tipo[num+6] == "AN" ||
      tipo[num+6] == "QN" || tipo[num+6] == "KN") && num+6 < 64 && num+6 >= 0){
        tab[num+6].attr({
          fill: 'red'
        });
        movimientos.push(num+6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (num%8 == 7){
      var pos_cas = 0;
      if((tipo[num+15] == 0 || tipo[num+15] == "PN" || tipo[num+15] == "CN" || tipo[num+15] == "TN" || tipo[num+15] == "AN" ||
      tipo[num+15] == "QN" || tipo[num+15] == "KN") && num+15 < 64 && num+15 >= 0){
        tab[num+15].attr({
          fill: 'red'
        });
        movimientos.push(num+15);
        pos_cas++;
      }
      if((tipo[num-17] == 0 || tipo[num-17] == "PN" || tipo[num-17] == "CN" || tipo[num-17] == "TN" || tipo[num-17] == "AN" ||
      tipo[num-17] == "QN" || tipo[num-17] == "KN") && num-17 < 64 && num-17 >= 0){
        tab[num-17].attr({
          fill: 'red'
        });
        movimientos.push(num-17);
        pos_cas++;
      }
      if((tipo[num-10] == 0 || tipo[num-10] == "PN" || tipo[num-10] == "CN" || tipo[num-10] == "TN" || tipo[num-10] == "AN" ||
      tipo[num-10] == "QN" || tipo[num-10] == "KN") && num-10 < 64 && num-10 >= 0){
        tab[num-10].attr({
          fill: 'red'
        });
        movimientos.push(num-10);
        pos_cas++;
      }
      if((tipo[num+6] == 0 || tipo[num+6] == "PN" || tipo[num+6] == "CN" || tipo[num+6] == "TN" || tipo[num+6] == "AN" ||
      tipo[num+6] == "QN" || tipo[num+6] == "KN") && num+6 < 64 && num+6 >= 0){
        tab[num+6].attr({
          fill: 'red'
        });
        movimientos.push(num+6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }
    else{
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PN" || tipo[num+17] == "CN" || tipo[num+17] == "TN" || tipo[num+17] == "AN" ||
      tipo[num+17] == "QN" || tipo[num+17] == "KN") && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          movimientos.push(num+17);
          pos_cas++;
        }
      if((tipo[num+15] == 0 || tipo[num+15] == "PN" || tipo[num+15] == "CN" || tipo[num+15] == "TN" || tipo[num+15] == "AN" ||
      tipo[num+15] == "QN" || tipo[num+15] == "KN") && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          movimientos.push(num+15);
          pos_cas++;
        }
      if((tipo[num-17] == 0 || tipo[num-17] == "PN" || tipo[num-17] == "CN" || tipo[num-17] == "TN" || tipo[num-17] == "AN" ||
      tipo[num-17] == "QN" || tipo[num-17] == "KN") && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          movimientos.push(num-17);
          pos_cas++;
        }
      if((tipo[num-15] == 0 || tipo[num-15] == "PN" || tipo[num-15] == "CN" || tipo[num-15] == "TN" || tipo[num-15] == "AN" ||
      tipo[num-15] == "QN" || tipo[num-15] == "KN") && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          movimientos.push(num-15);
          pos_cas++;
        }
      if((tipo[num+10] == 0 || tipo[num+10] == "PN" || tipo[num+10] == "CN" || tipo[num+10] == "TN" || tipo[num+10] == "AN" ||
      tipo[num+10] == "QN" || tipo[num+10] == "KN") && num+10 < 64 && num+10 >= 0){
          tab[num+10].attr({
            fill: 'red'
          });
          movimientos.push(num+10);
          pos_cas++;
        }
      if((tipo[num-6] == 0 || tipo[num-6] == "PN" || tipo[num-6] == "CN" || tipo[num-6] == "TN" || tipo[num-6] == "AN" ||
      tipo[num-6] == "QN" || tipo[num-6] == "KN") && num-6 < 64 && num-6 >= 0){
          tab[num-6].attr({
            fill: 'red'
          });
          movimientos.push(num-6);
          pos_cas++;
        }
      if((tipo[num-10] == 0 || tipo[num-10] == "PN" || tipo[num-10] == "CN" || tipo[num-10] == "TN" || tipo[num-10] == "AN" ||
      tipo[num-10] == "QN" || tipo[num-10] == "KN") && num-10 < 64 && num-10 >= 0){
          tab[num-10].attr({
            fill: 'red'
          });
          movimientos.push(num-10);
          pos_cas++;
        }
      if((tipo[num+6] == 0 || tipo[num+6] == "PN" || tipo[num+6] == "CN" || tipo[num+6] == "TN" || tipo[num+6] == "AN" ||
      tipo[num+6] == "QN" || tipo[num+6] == "KN") && num+6 < 64 && num+6 >= 0){
        tab[num+6].attr({
          fill: 'red'
        });
        movimientos.push(num+6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }
  }

  function movimiento_cn(tipo,num){
    if (num%8 == 0){
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PB" || tipo[num+17] == "CB" || tipo[num+17] == "TB" || tipo[num+17] == "AB" ||
      tipo[num+17] == "QB" || tipo[num+17] == "KB") && num+17 < 64 && num+17 >= 0){
        tab[num+17].attr({
          fill: 'red'
        });
        movimientos.push(num+17);
        pos_cas++;
      }
      if((tipo[num-15] == 0 || tipo[num-15] == "PB" || tipo[num-15] == "CB" || tipo[num-15] == "TB" || tipo[num-15] == "AB" ||
      tipo[num-15] == "QB" || tipo[num-15] == "KB") && num-15 < 64 && num-15 >= 0){
        tab[num-15].attr({
          fill: 'red'
        });
        movimientos.push(num-15);
        pos_cas++;
      }
      if((tipo[num+10] == 0 || tipo[num+10] == "PB" || tipo[num+10] == "CB" || tipo[num+10] == "TB" || tipo[num+10] == "AB" ||
      tipo[num+10] == "QB" || tipo[num+10] == "KB") && num+10 < 64 && num+10 >= 0){
        tab[num+10].attr({
          fill: 'red'
        });
        movimientos.push(num+10);
        pos_cas++;
      }
      if((tipo[num-6] == 0 || tipo[num-6] == "PB" || tipo[num-6] == "CB" || tipo[num-6] == "TB" || tipo[num-6] == "AB" ||
      tipo[num-6] == "QB" || tipo[num-6] == "KB") && num-6 < 64 && num-6 >= 0){
        tab[num-6].attr({
          fill: 'red'
        });
        movimientos.push(num-6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (num%8 == 1){
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PB" || tipo[num+17] == "CB" || tipo[num+17] == "TB" || tipo[num+17] == "AB" ||
      tipo[num+17] == "QB" || tipo[num+17] == "KB") && num+17 < 64 && num+17 >= 0){
        tab[num+17].attr({
          fill: 'red'
        });
        movimientos.push(num+17);
        pos_cas++;
      }
      if((tipo[num+15] == 0 || tipo[num+15] == "PB" || tipo[num+15] == "CB" || tipo[num+15] == "TB" || tipo[num+15] == "AB" ||
      tipo[num+15] == "QB" || tipo[num+15] == "KB") && num+15 < 64 && num+15 >= 0){
        tab[num+15].attr({
          fill: 'red'
        });
        movimientos.push(num+15);
        pos_cas++;
      }
      if((tipo[num-17] == 0 || tipo[num-17] == "PB" || tipo[num-17] == "CB" || tipo[num-17] == "TB" || tipo[num-17] == "AB" ||
      tipo[num-17] == "QB" || tipo[num-17] == "KB") && num-17 < 64 && num-17 >= 0){
        tab[num-17].attr({
          fill: 'red'
        });
        movimientos.push(num-17);
        pos_cas++;
      }
      if((tipo[num-15] == 0 || tipo[num-15] == "PB" || tipo[num-15] == "CB" || tipo[num-15] == "TB" || tipo[num-15] == "AB" ||
      tipo[num-15] == "QB" || tipo[num-15] == "KB") && num-15 < 64 && num-15 >= 0){
        tab[num-15].attr({
          fill: 'red'
        });
        movimientos.push(num-15);
        pos_cas++;
      }
      if((tipo[num+10] == 0 || tipo[num+10] == "PB" || tipo[num+10] == "CB" || tipo[num+10] == "TB" || tipo[num+10] == "AB" ||
      tipo[num+10] == "QB" || tipo[num+10] == "KB") && num+10 < 64 && num+10 >= 0){
        tab[num+10].attr({
          fill: 'red'
        });
        movimientos.push(num+10);
        pos_cas++;
      }
      if((tipo[num-6] == 0 || tipo[num-6] == "PB" || tipo[num-6] == "CB" || tipo[num-6] == "TB" || tipo[num-6] == "AB" ||
      tipo[num-6] == "QB" || tipo[num-6] == "KB") && num-6 < 64 && num-6 >= 0){
        tab[num-6].attr({
          fill: 'red'
        });
        movimientos.push(num-6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (num%8 == 6){
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PB" || tipo[num+17] == "CB" || tipo[num+17] == "TB" || tipo[num+17] == "AB" ||
      tipo[num+17] == "QB" || tipo[num+17] == "KB") && num+17 < 64 && num+17 >= 0){
        tab[num+17].attr({
          fill: 'red'
        });
        movimientos.push(num+17);
        pos_cas++;
      }
      if((tipo[num+15] == 0 || tipo[num+15] == "PB" || tipo[num+15] == "CB" || tipo[num+15] == "TB" || tipo[num+15] == "AB" ||
      tipo[num+15] == "QB" || tipo[num+15] == "KB") && num+15 < 64 && num+15 >= 0){
        tab[num+15].attr({
          fill: 'red'
        });
        movimientos.push(num+15);
        pos_cas++;
      }
      if((tipo[num-17] == 0 || tipo[num-17] == "PB" || tipo[num-17] == "CB" || tipo[num-17] == "TB" || tipo[num-17] == "AB" ||
      tipo[num-17] == "QB" || tipo[num-17] == "KB") && num-17 < 64 && num-17 >= 0){
        tab[num-17].attr({
          fill: 'red'
        });
        movimientos.push(num-17);
        pos_cas++;
      }
      if((tipo[num-15] == 0 || tipo[num-15] == "PB" || tipo[num-15] == "CB" || tipo[num-15] == "TB" || tipo[num-15] == "AB" ||
      tipo[num-15] == "QB" || tipo[num-15] == "KB") && num-15 < 64 && num-15 >= 0){
        tab[num-15].attr({
          fill: 'red'
        });
        movimientos.push(num-15);
        pos_cas++;
      }
      if((tipo[num-10] == 0 || tipo[num-10] == "PB" || tipo[num-10] == "CB" || tipo[num-10] == "TB" || tipo[num-10] == "AB" ||
      tipo[num-10] == "QB" || tipo[num-10] == "KB") && num-10 < 64 && num-10 >= 0){
        tab[num-10].attr({
          fill: 'red'
        });
        movimientos.push(num-10);
        pos_cas++;
      }
      if((tipo[num+6] == 0 || tipo[num+6] == "PB" || tipo[num+6] == "CB" || tipo[num+6] == "TB" || tipo[num+6] == "AB" ||
      tipo[num+6] == "QB" || tipo[num+6] == "KB") && num+6 < 64 && num+6 >= 0){
        tab[num+6].attr({
          fill: 'red'
        });
        movimientos.push(num+6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }else
    if (num%8 == 7){
      var pos_cas = 0;
      if((tipo[num+15] == 0 || tipo[num+15] == "PB" || tipo[num+15] == "CB" || tipo[num+15] == "TB" || tipo[num+15] == "AB" ||
      tipo[num+15] == "QB" || tipo[num+15] == "KB") && num+15 < 64 && num+15 >= 0){
        tab[num+15].attr({
          fill: 'red'
        });
        movimientos.push(num+15);
        pos_cas++;
      }
      if((tipo[num-17] == 0 || tipo[num-17] == "PB" || tipo[num-17] == "CB" || tipo[num-17] == "TB" || tipo[num-17] == "AB" ||
      tipo[num-17] == "QB" || tipo[num-17] == "KB") && num-17 < 64 && num-17 >= 0){
        tab[num-17].attr({
          fill: 'red'
        });
        movimientos.push(num-17);
        pos_cas++;
      }
      if((tipo[num-10] == 0 || tipo[num-10] == "PB" || tipo[num-10] == "CB" || tipo[num-10] == "TB" || tipo[num-10] == "AB" ||
      tipo[num-10] == "QB" || tipo[num-10] == "KB") && num-10 < 64 && num-10 >= 0){
        tab[num-10].attr({
          fill: 'red'
        });
        movimientos.push(num-10);
        pos_cas++;
      }
      if((tipo[num+6] == 0 || tipo[num+6] == "PB" || tipo[num+6] == "CB" || tipo[num+6] == "TB" || tipo[num+6] == "AB" ||
      tipo[num+6] == "QB" || tipo[num+6] == "KB") && num+6 < 64 && num+6 >= 0){
        tab[num+6].attr({
          fill: 'red'
        });
        movimientos.push(num+6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }
    else{
      var pos_cas = 0;
      if((tipo[num+17] == 0 || tipo[num+17] == "PB" || tipo[num+17] == "CB" || tipo[num+17] == "TB" || tipo[num+17] == "AB" ||
      tipo[num+17] == "QB" || tipo[num+17] == "KB") && num+17 < 64 && num+17 >= 0){
          tab[num+17].attr({
            fill: 'red'
          });
          movimientos.push(num+17);
          pos_cas++;
        }
      if((tipo[num+15] == 0 || tipo[num+15] == "PB" || tipo[num+15] == "CB" || tipo[num+15] == "TB" || tipo[num+15] == "AB" ||
      tipo[num+15] == "QB" || tipo[num+15] == "KB") && num+15 < 64 && num+15 >= 0){
          tab[num+15].attr({
            fill: 'red'
          });
          movimientos.push(num+15);
          pos_cas++;
        }
      if((tipo[num-17] == 0 || tipo[num-17] == "PB" || tipo[num-17] == "CB" || tipo[num-17] == "TB" || tipo[num-17] == "AB" ||
      tipo[num-17] == "QB" || tipo[num-17] == "KB") && num-17 < 64 && num-17 >= 0){
          tab[num-17].attr({
            fill: 'red'
          });
          movimientos.push(num-17);
          pos_cas++;
        }
      if((tipo[num-15] == 0 || tipo[num-15] == "PB" || tipo[num-15] == "CB" || tipo[num-15] == "TB" || tipo[num-15] == "AB" ||
      tipo[num-15] == "QB" || tipo[num-15] == "KB") && num-15 < 64 && num-15 >= 0){
          tab[num-15].attr({
            fill: 'red'
          });
          movimientos.push(num-15);
          pos_cas++;
        }
      if((tipo[num+10] == 0 || tipo[num+10] == "PB" || tipo[num+10] == "CB" || tipo[num+10] == "TB" || tipo[num+10] == "AB" ||
      tipo[num+10] == "QB" || tipo[num+10] == "KB") && num+10 < 64 && num+10 >= 0){
          tab[num+10].attr({
            fill: 'red'
          });
          movimientos.push(num+10);
          pos_cas++;
        }
      if((tipo[num-6] == 0 || tipo[num-6] == "PB" || tipo[num-6] == "CB" || tipo[num-6] == "TB" || tipo[num-6] == "AB" ||
      tipo[num-6] == "QB" || tipo[num-6] == "KB") && num-6 < 64 && num-6 >= 0){
          tab[num-6].attr({
            fill: 'red'
          });
          movimientos.push(num-6);
          pos_cas++;
        }
      if((tipo[num-10] == 0 || tipo[num-10] == "PB" || tipo[num-10] == "CB" || tipo[num-10] == "TB" || tipo[num-10] == "AB" ||
      tipo[num-10] == "QB" || tipo[num-10] == "KB") && num-10 < 64 && num-10 >= 0){
          tab[num-10].attr({
            fill: 'red'
          });
          movimientos.push(num-10);
          pos_cas++;
        }
      if((tipo[num+6] == 0 || tipo[num+6] == "PB" || tipo[num+6] == "CB" || tipo[num+6] == "TB" || tipo[num+6] == "AB" ||
      tipo[num+6] == "QB" || tipo[num+6] == "KB") && num+6 < 64 && num+6 >= 0){
        tab[num+6].attr({
          fill: 'red'
        });
        movimientos.push(num+6);
        pos_cas++;
      }
      if(pos_cas == 0){
        alert("ningún movimiento es posible");
      }
    }
  }

  function movimiento_kb(tipo,num){
    var pos_cas = 0;
    if((tipo[num+8] == 0 || tipo[num+8] == "PN" || tipo[num+8] == "CN" || tipo[num+8] == "TN" || tipo[num+8] == "AN" ||
    tipo[num+8] == "QN" || tipo[num+8] == "KN") && num+8 < 64 && num+8 >= 0){
      tab[num+8].attr({
        fill: 'red'
      });
      movimientos.push(num+8);
      pos_cas++;
    }
    if((tipo[num+1] == 0 || tipo[num+1] == "PN" || tipo[num+1] == "CN" || tipo[num+1] == "TN" || tipo[num+1] == "AN" ||
    tipo[num+1] == "QN" || tipo[num+1] == "KN") && num+1 < 64 && num+1 >= 0){
      tab[num+1].attr({
        fill: 'red'
      });
      movimientos.push(num+1);
      pos_cas++;
    }
    if((tipo[num-8] == 0 || tipo[num-8] == "PN" || tipo[num-8] == "CN" || tipo[num-8] == "TN" || tipo[num-8] == "AN" ||
    tipo[num-8] == "QN" || tipo[num-8] == "KN") && num-8 < 64 && num-8 >= 0){
      tab[num-8].attr({
        fill: 'red'
      });
      movimientos.push(num-8);
      pos_cas++;
    }
    if((tipo[num-1] == 0 || tipo[num-1] == "PN" || tipo[num-1] == "CN" || tipo[num-1] == "TN" || tipo[num-1] == "AN" ||
    tipo[num-1] == "QN" || tipo[num-1] == "KN") && num-1 < 64 && num-1 >= 0){
      tab[num-1].attr({
        fill: 'red'
      });
      movimientos.push(num-1);
      pos_cas++;
    }
    if((tipo[num+9] == 0 || tipo[num+9] == "PN" || tipo[num+9] == "CN" || tipo[num+9] == "TN" || tipo[num+9] == "AN" ||
    tipo[num+9] == "QN" || tipo[num+9] == "KN") && num+9 < 64 && num+9 >= 0){
      tab[num+9].attr({
        fill: 'red'
      });
      movimientos.push(num+9);
      pos_cas++;
    }
    if((tipo[num-7] == 0 || tipo[num-7] == "PN" || tipo[num-7] == "CN" || tipo[num-7] == "TN" || tipo[num-7] == "AN" ||
    tipo[num-7] == "QN" || tipo[num-7] == "KN") && num-7 < 64 && num-7 >= 0){
      tab[num-7].attr({
        fill: 'red'
      });
      movimientos.push(num-7);
      pos_cas++;
    }
    if((tipo[num-9] == 0 || tipo[num-9] == "PN" || tipo[num-9] == "CN" || tipo[num-9] == "TN" || tipo[num-9] == "AN" ||
    tipo[num-9] == "QN" || tipo[num-9] == "KN") && num-9 < 64 && num-9 >= 0){
      tab[num-9].attr({
        fill: 'red'
      });
      movimientos.push(num-9);
      pos_cas++;
    }
    if((tipo[num+7] == 0 || tipo[num+7] == "PN" || tipo[num+7] == "CN" || tipo[num+7] == "TN" || tipo[num+7] == "AN" ||
    tipo[num+7] == "QN" || tipo[num+7] == "KN") && num+7 < 64 && num+7 >= 0){
      tab[num+7].attr({
        fill: 'red'
      });
      movimientos.push(num+7);
      pos_cas++;
    }
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
    }
  }

  function movimiento_kn(tipo,num){
    var pos_cas = 0;
    if((tipo[num+8] == 0 || tipo[num+8] == "PB" || tipo[num+8] == "CB" || tipo[num+8] == "TB" || tipo[num+8] == "AB" ||
    tipo[num+8] == "QB" || tipo[num+8] == "KB") && num+8 < 64 && num+8 >= 0){
      tab[num+8].attr({
        fill: 'red'
      });
      movimientos.push(num+8);
      pos_cas++;
    }
    if((tipo[num+1] == 0 || tipo[num+1] == "PB" || tipo[num+1] == "CB" || tipo[num+1] == "TB" || tipo[num+1] == "AB" ||
    tipo[num+1] == "QB" || tipo[num+1] == "KB") && num+1 < 64 && num+1 >= 0){
      tab[num+1].attr({
        fill: 'red'
      });
      movimientos.push(num+1);
      pos_cas++;
    }
    if((tipo[num-8] == 0 || tipo[num-8] == "PB" || tipo[num-8] == "CB" || tipo[num-8] == "TB" || tipo[num-8] == "AB" ||
    tipo[num-8] == "QB" || tipo[num-8] == "KB") && num-8 < 64 && num-8 >= 0){
      tab[num-8].attr({
        fill: 'red'
      });
      movimientos.push(num-8);
      pos_cas++;
    }
    if((tipo[num-1] == 0 || tipo[num-1] == "PB" || tipo[num-1] == "CB" || tipo[num-1] == "TB" || tipo[num-1] == "AB" ||
    tipo[num-1] == "QB" || tipo[num-1] == "KB") && num-1 < 64 && num-1 >= 0){
      tab[num-1].attr({
        fill: 'red'
      });
      movimientos.push(num-1);
      pos_cas++;
    }
    if((tipo[num+9] == 0 || tipo[num+9] == "PB" || tipo[num+9] == "CB" || tipo[num+9] == "TB" || tipo[num+9] == "AB" ||
    tipo[num+9] == "QB" || tipo[num+9] == "KB") && num+9 < 64 && num+9 >= 0){
      tab[num+9].attr({
        fill: 'red'
      });
      movimientos.push(num+9);
      pos_cas++;
    }
    if((tipo[num-7] == 0 || tipo[num-7] == "PB" || tipo[num-7] == "CB" || tipo[num-7] == "TB" || tipo[num-7] == "AB" ||
    tipo[num-7] == "QB" || tipo[num-7] == "KB") && num-7 < 64 && num-7 >= 0){
      tab[num-7].attr({
        fill: 'red'
      });
      movimientos.push(num-7);
      pos_cas++;
    }
    if((tipo[num-9] == 0 || tipo[num-9] == "PB" || tipo[num-9] == "CB" || tipo[num-9] == "TB" || tipo[num-9] == "AB" ||
    tipo[num-9] == "QB" || tipo[num-9] == "KB") && num-9 < 64 && num-9 >= 0){
      tab[num-9].attr({
        fill: 'red'
      });
      movimientos.push(num-9);
      pos_cas++;
    }
    if((tipo[num+7] == 0 || tipo[num+7] == "PB" || tipo[num+7] == "CB" || tipo[num+7] == "TB" || tipo[num+7] == "AB" ||
    tipo[num+7] == "QB" || tipo[num+7] == "KB") && num+7 < 64 && num+7 >= 0){
      tab[num+7].attr({
        fill: 'red'
      });
      movimientos.push(num+7);
      pos_cas++;
    }
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
    }
  }

  function movimiento_ab(tipo,num){
    var pos_cas = 0;
    var caza = false;
    for(var i = 9; num+i < 64 && (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i += 9){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    caza = false;
    for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i += 7){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i += 9){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i += 7){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }

  function movimiento_an(tipo,num){
    var pos_cas = 0;
    var caza = false;
    for(var i = 9; num+i < 64 && (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i += 9){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    caza = false;
    for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i += 7){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i += 9){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "KB"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i += 7){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "BN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }

  function movimiento_tb(tipo,num){
    var pos_cas = 0;
    var caza = false;
    for(var i = 8; num+i < 64 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i += 8){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 8; num-i >= 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i += 8){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i++){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i++){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }

  function movimiento_tn(tipo,num){
    var pos_cas = 0;
    var caza = false;
    for(var i = 8; num+i < 64 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i += 8){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 8; num-i >= 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i += 8){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "KB"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i++){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i++){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "KB"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }

  function movimiento_qb(tipo,num){
    var pos_cas = 0;
    var caza = false;
    for(var i = 8; num+i < 64 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i += 8){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 8; num-i >= 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i += 8){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i++){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i++){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 9; num+i < 64 && (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i += 9){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    caza = false;
    for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
    tipo[num+i] == "QN" || tipo[num+i] == "KN") && caza == false; i += 7){
      if (tipo[num+i] == "PN" || tipo[num+i] == "CN" || tipo[num+i] == "TN" || tipo[num+i] == "AN" ||
      tipo[num+i] == "QN" || tipo[num+i] == "KN"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i += 9){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
    tipo[num-i] == "QN" || tipo[num-i] == "KN") && caza == false; i += 7){
      if (tipo[num-i] == "PN" || tipo[num-i] == "CN" || tipo[num-i] == "TN" || tipo[num-i] == "AN" ||
      tipo[num-i] == "QN" || tipo[num-i] == "KN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }

  function movimiento_qn(tipo,num){
    var pos_cas = 0;
    var caza = false;
    for(var i = 8; num+i < 64 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i += 8){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 8; num-i >= 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i += 8){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "KB"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i++){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 1; (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i++){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "KB"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 9; num+i < 64 && (num+i)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i += 9){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    caza = false;
    for(var i = 7; num+i < 64 && (num+i+1)%8 != 0 && (tipo[num+i] == 0 || tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
    tipo[num+i] == "QB" || tipo[num+i] == "KB") && caza == false; i += 7){
      if (tipo[num+i] == "PB" || tipo[num+i] == "CB" || tipo[num+i] == "TB" || tipo[num+i] == "AB" ||
      tipo[num+i] == "QB" || tipo[num+i] == "KB"){
        caza = true;
      }
      tab[num+i].attr({
        fill: 'red'
      });
      movimientos.push(num+i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 9; num-i >= 0 && (num-i+1)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i += 9){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "KB"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    for(var i = 7; num-i >= 0 && (num-i)%8 != 0 && (tipo[num-i] == 0 || tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
    tipo[num-i] == "QB" || tipo[num-i] == "KB") && caza == false; i += 7){
      if (tipo[num-i] == "PB" || tipo[num-i] == "CB" || tipo[num-i] == "TB" || tipo[num-i] == "AB" ||
      tipo[num-i] == "QB" || tipo[num-i] == "BN"){
        caza = true;
      }
      tab[num-i].attr({
        fill: 'red'
      });
      movimientos.push(num-i);
      pos_cas++;
    }
    var caza = false;
    if(pos_cas == 0){
      alert("ningún movimiento es posible");
      return false;
    }
  }
//generando una variable sin "var" creamos una variable que se puede usar en
//cualquier .js (main.js, tablero.js....) que se referencie en el .ejs
//parametros: pos_x, pos_y, width, height
//cas = tablero.rect(0,0,200,400);

//Con el 'this', seleccoionamos el objeto casilla

  for (var i = 0; i < 64; i++){
    tab[i].node.onclick = function(){
      if (turno == orden){
        for (var j = 0; j < 64; j++){
          if (tab[j].node == this){
            modo = identificar_cas(pieza, j, modo);
          }
        }
      }else{
        alert("no turno");
      }
      //modo false -> seleccion
      //modo true -> movimiento
    };
  }

  function limpiar_tablero(){
    for (var i = 0; i <= 63; i++){
      tab[i].attr({
        fill: 'transparent'
      });
    }
  }

  function hay_mov(){
    if (movimientos.length == 0){
      return false;
    }else{
      return true;
    }
  }

  function comprobar_movimiento(seleccion){
    for (var i = 0; i < movimientos.length; i++){
      if (movimientos[i] == seleccion){
        return true;
      }
    }
    return false;
  }

}


/*

2 arrays: 1o guardar objetos casilla (unidimensional)
2o unidimensional estado casilla (vacio, ficha_blanca, ficha_negra)

*/
