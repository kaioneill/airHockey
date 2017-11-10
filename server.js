var serverPuck;
var serverSticks = [];

function Puck(x,y, xS, yS) {
  this.x = x;
  this.y = y;
  this.d = 25;
  this.xS = xS;
  this.yS = yS;
}

function Stick(id,x,y) {
	this.id = id;
  this.x = x;
  this.y = y;
  this.d = 30;
  this.xS = 0;
  this.yS = 0;
  this.show = function() {
    ellipse(this.x, this.y, this.d, this.d);
    fill(color(0, 0, 255));
  }

}



var express = require('express');


var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("socket server running");

var socket = require('socket.io');

var io = socket(server);


setInterval(heartbeat, 10);


function heartbeat() {
	io.sockets.emit('sendPuck', serverPuck);
	io.sockets.emit('sendStick', serverSticks);
}




io.sockets.on('connection', newConnection);

function newConnection(socket) {
	console.log('new connection: ' + socket.id);




	socket.on('start',
      function(puck) {
        var serverPuck = new Puck(puck.x, puck.y, puck.xS, puck.yS);
      }
    );
	socket.on('stickStart',
			function(stick) {
				var stick = new Stick(socket.id, stick.x, stick.y);
        serverSticks.push(stick);
			});


	socket.on('puckData', puckMsg);

	function puckMsg(puck) {
		serverPuck = puck;
		socket.broadcast.emit('puck', puck);
		//console.log(puck);
	}




	socket.on('stickData', stickMsg);

	function stickMsg(stick) {
		var serverStick;

		for (var i = 0; i < serverSticks.length; i++) {
			if (socket.id == serverSticks[i].id) {
				serverStick = serverSticks[i];
			}
		}
		serverStick.x = stick.x;
		serverStick.y = stick.y;
		serverStick.d = stick.d;
		console.log(serverSticks);
		socket.emit('stick', serverStick);
	}


}