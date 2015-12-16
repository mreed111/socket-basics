var PORT = process.env.PORT || 3000;
var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');
	
	socket.on('joinChatRoom', function (req) {
		//
		clientInfo[socket.id] = req;
		//
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});
	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);
		message.timestamp = moment().valueOf();
		// io.emit  
		// send to all sockets
		//send to all sockets but the sender -- socket.broadcast.emit('message', message);
		console.log('...emitting msg "'+message.text+'" from ' + message.name );
		io.to(clientInfo[socket.id].room).emit('message', message);  	
	});
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to my Chat App!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server listening on port ' + PORT);
});
