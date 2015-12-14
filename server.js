var PORT = process.env.PORT || 3000;
var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	console.log('User connected via socket.io');
	
	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);
		
		// io.emit  // send to all sockets
		socket.broadcast.emit('message', message);  //send to all sockets but the sender.	
	});
	socket.emit('message', {
		text: 'Welcome to my Chat App.'
	});
});

http.listen(PORT, function () {
	console.log('Server listening on port ' + PORT);
});
