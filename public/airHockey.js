
var socket;


var h = 500;
var w = 500;
var puck;
var stick;
var sticks = [];
var goalB;
var goalT;
var slide = .9;
var puckReset;
var scoreReset;
var p1 = 0;
var p2 = 0;



function Puck(x,y) {
  this.x = x;
  this.y = y;
  this.d = 25;
  this.xS = 0;
  this.yS = 0;
  // this.show = function() {
  //   ellipse(this.x, this.y, this.d, this.d);
  //   fill(color(255, 0, 0));
  // }

}

function Stick(x,y) {
  this.id = "";
  this.x = x;
  this.y = y;
  this.d = 30;
  this.xS = mouseX - pmouseX;
  this.yS = mouseY - pmouseY;
  this.show = function() {
    ellipse(this.x, this.y, this.d, this.d);
    fill(color(0, 0, 255));
  }

}


function Goalpost(x, y) {
    this.x = x;
    this.y = y;
    this.show =  function() {
        rect(this.x, this.y, 100, 5);
    }
}

function pReset() {
    puck.xS = 0;
    puck.yS = 0;
    puck.x = 250;
    puck.y = 250;
}

function sReset() {
    p1 = 0;
    p2 = 0;
}

function checkX() {
  if (puck.x + puck.d / 2 >= w) {
    puck.x = (w - puck.d / 2) - 5;
    puck.xS *= -1;
  }

  if (puck.x <= puck.d / 2) {
    puck.x = (puck.d / 2) + 5;
    puck.xS *= -1;
  }
}

function checkY() {
  if (puck.y + puck.d / 2 >= w) {
    puck.y = (w - puck.d / 2) - 5;
    puck.yS *= -1;
      if(puck.x > 200 && puck.x <300) {
          pReset();
          p1++;
      }
  }

  if (puck.y <= puck.d / 2) {
    puck.y = (puck.d / 2) + 5;
    puck.yS *= -1;
      if(puck.x > 200 && puck.x <300) {
          pReset();
          p2++;
      }
  }
}

function hitCheck() {
  if (Math.abs(stick.x - puck.x) < ((puck.d) / 2 + (stick.d) / 2) && Math.abs(stick.y - puck.y) < ((puck.d) / 2 + (stick.d) / 2)) {
    hit();
  }
}

function hit() {
  puck.xS += mouseX - pmouseX;
  puck.yS += mouseY - pmouseY;
}

// function mouseMoved() {

//   var data = {
//     x: mouseX,
//     y: mouseY
//   }
//   socket.emit('mouse', data);

// }




function updatePuck(serverPuck) {
  puck.x = serverPuck.x;
  puck.y = serverPuck.y;
  puck.xS = serverPuck.xS;
  puck.yS = serverPuck.yS;
}

function updateStick(serverStick) {
  sticks[1].x = serverStick.x;
  sticks[1].y = serverStick.y;
}


function setup() {
  createCanvas(w, h);
  puck = new Puck(w/2,h/2);
  stick = new Stick(mouseX, mouseY);

  socket = io.connect('http://localhost:3000');
  //socket.on('mouse', moveStick);

  socket.emit('start', puck);
  socket.emit('stickStart', stick);

  socket.on('sendPuck', 
      function(serverPuck) {
        puck = serverPuck;
      }
    );

  socket.on('sendStick', 
      function(serverSticks) {
        sticks = serverSticks;
      }
    );

  socket.on('puck', updatePuck);
  socket.on('stick', updateStick);
  




  
  
  goalB = new Goalpost(200,h-6);
  goalT = new Goalpost(202,0);
  puckReset = createButton('reset puck');
  puckReset.mousePressed(pReset);
  scoreReset = createButton('reset score');
  scoreReset.mousePressed(sReset);
  scoreReset.mousePressed(pReset);
}

function draw() {
  background(200);
  //puck.show();
  stick.show();
  goalB.show();
  goalT.show();


  ellipse(puck.x, puck.y, puck.d, puck.d);
  fill(color(255, 0, 0));




    
  stick.x = mouseX;
  stick.y = mouseY;

  checkX();
  checkY();
  hitCheck();

  Math.round(puck.x);
  Math.round(puck.y);
  puck.x += puck.xS;
  puck.y += puck.yS;
  puck.xS *= slide;
  puck.yS *= slide;
  Math.round(puck.xS);
  Math.round(puck.yS);

  fill(0,0,255);
  
    

  socket.emit('puckData', puck);
  socket.emit('stickData', stick);

  //sticks[i].show();

    
  text("p1 score: " + p1, w-80, 20);
  text("p2 score: " + p2, w-80, h-20);

  //text("xS: " + slide * (mouseX - pmouseX), 20, 20);
  //text("yS: " + slide * (mouseY - pmouseY), 20, 40);
  //text("puckLoc: " + Math.round(puck.x) + " " + Math.round(puck.y), 100, 20);
  //text("stickLoc: " + stick.x + " " + stick.y, 100, 40);

}