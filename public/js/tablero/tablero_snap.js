window.onload=function(){

//Asignamos el svg tablero a una variable
  var tablero = Snap("#tablero");
  var x = 0;
  var y = 0;
    var origen;

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
        return false;
      }else{
        alert(piezas[num]);
        alert(num);
        movimiento_pieza(piezas, num);
      }
    }
  }

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
