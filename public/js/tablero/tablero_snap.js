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
  //negro = false;


  function pintar_casilla(){
    for (var i = 1; i <= 64; i++){
      cas = tablero.rect(x,y,60,60);
      //if (negro == false){
        cas.attr({
          fill: 'transparent'
        });
        /*negro = true;
      }else{
        cas.attr({
          fill: 'black'
        });
        negro = false;
      }*/

      if(i%8 == 0 && i != 0){
        x = 0;
        y += 60;
        /*if (negro == false){
          negro = true;
        }else{
          negro = false;
        }*/
      }else{
        x += 60;
      }

      tab.push(cas);
    }
  }

  /*function representar_tablero(piezas){
    for (var i = 0; i < 64; i++){
      if (piezas[i] != 0){
        document.body.style.backgroundImage = "url('../../img/" + piezas[i] + ".png')";
      }
    }
  }*/

  pintar_casilla();

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

  for (var i = 0; i < 16; i++){
    blancas[i][0].node.onclick = function(){
      //node -> NADA QUE VER CON NODEJS --> objeto svg
      //modo false -> seleccion
      //modo true -> movimiento
      for (var j = 0; j < 16; j++){
        if (blancas[j][0].node == this){
          //identificar(j+1);
          alert(blancas[j][0]);
          alert(blancas[j][1]);
          alert(blancas[j][2]);
          //alert(pieza[j]);
          modo = identificar_cas(pieza, blancas[j][2], modo);
        }
      }
    };
  }

  for (var i = 0; i < 16; i++){
    negras[i][0].node.onclick = function(){
      //node -> NADA QUE VER CON NODEJS --> objeto svg
      //modo false -> seleccion
      //modo true -> movimiento
      for (var j = 0; j < 16; j++){
        if (negras[j][0].node == this){
          //identificar(j+1);
          alert(blancas[j][0]);
          alert(blancas[j][1]);
          alert(blancas[j][2]);
          //alert(pieza[j]);
          modo = identificar_cas(pieza, negras[j][2], modo);
        }
      }
    };
  }
  //var prueba = tablero.image("../../img/PB.png", 0, 0, 60, 60);
  //representar_tablero(pieza);

  function identificar_cas(piezas, num, modo){
    if (modo == false){
      if (piezas[num] == 0){
        alert("Casilla vacía, selecciona otra");
      }else{
        alert(piezas[num]);
        alert(num);
        origen = num;
        movimiento_pieza(piezas, num);
        return true;
      }
    }else{
      if (piezas[num] == 0){
        alert("Movimiento en desarrollo");
        for (var i = 1; i <= 63; i++){
          tab[i].attr({
            fill: 'transparent'
          });
        }
        alert(piezas[num]);
        alert(piezas[origen]);
        piezas[num] = piezas[origen];
        piezas[origen] = 0;
        for(var i = 0; i < 16; i++){
          if (blancas[i][2] == origen){
            blancas[i][2] = num;
            /*blancas[i][0].animate(1000).attr({
              x:500,
              y:500
            });*/
            blancas[i][0].animate({
              x:(num%8)*60,
              y:(Math.trunc(num/8))*60
            }, 1000);
            alert(Math.trunc(num/8));
          }
        }
        for(var i = 0; i < 16; i++){
          if (negras[i][2] == origen){
            negras[i][2] = num;
            /*blancas[i][0].animate(1000).attr({
              x:500,
              y:500
            });*/
          socket.emit("movimiento", num, i);
            // negras[i][0].animate({
            //   x:(num%8)*60,
            //   y:(Math.trunc(num/8))*60
            // }, 1000);
            alert(Math.trunc(num/8));
          }
        }
        return false;
      }else{
        alert(piezas[num]);
        alert(num);
        for (var i = 1; i <= 63; i++){
          tab[i].attr({
            fill: 'transparent'
          });
        }
        movimiento_pieza(piezas, num);
      }
    }
  }
  socket.on("prueba_mov", function(num, i){
    alert(num);
    alert(i);
    negras[i][0].animate({
      x:(num%8)*60,
      y:(Math.trunc(num/8))*60
    }, 1000);
  });
  function movimiento_pieza(tipo, num){
    if (tipo[num] == "PB"){
      if(tipo[num+8] == 0 && num+8 < 64 && num+8 >= 0){
        tab[num+8].attr({
          fill: 'red'
        });
      }else{
        alert("ningún movimiento es posible");
      }
    }else
    if (tipo[num] == "PN"){
      if(tipo[num-8] == 0  && num-8 < 64 && num-8 >= 0){
        tab[num-8].attr({
          fill: 'red'
        });
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
//generando una variable sin "var" creamos una variable que se puede usar en
//cualquier .js (main.js, tablero.js....) que se referencie en el .ejs
//parametros: pos_x, pos_y, width, height
//cas = tablero.rect(0,0,200,400);

//Con el 'this', seleccoionamos el objeto casilla

  for (var i = 0; i < 64; i++){
    tab[i].node.onclick = function(){
      //modo false -> seleccion
      //modo true -> movimiento
      for (var j = 0; j < 64; j++){
        if (tab[j].node == this){
          //identificar(j+1);
          alert(j+1);
          //alert(pieza[j]);
          modo = identificar_cas(pieza, j, modo);
        }
      }
    };
  }

}


/*

2 arrays: 1o guardar objetos casilla (unidimensional)
2o unidimensional estado casilla (vacio, ficha_blanca, ficha_negra)

*/
