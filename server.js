var PORT = process.env.PORT || 3000;
var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];
	
	if (typeof info === 'undefined') {
		return;
	}
	
	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];
		
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});
	socket.emit('message', systemMessage('Current users: ' + users.join(', ')));
}

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');
	
	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];
		
		if ( typeof userData !== 'undefined' ) {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', systemMessage(userData.name + ' has left!'));
		}
	});
	
	socket.on('joinChatRoom', function (req) {
		//
		clientInfo[socket.id] = req;
		//
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', systemMessage(req.name + ' has joined!'));
	});
	
	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);
		
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			console.log('...emitting msg "'+message.text+'" from ' + message.name );
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});
	socket.emit('message', systemMessage('Welcome to my Chat App!'));
});

function systemMessage (message) {
	return {
		name: 'System',
		text: message,
		timestamp: moment().valueOf()	
	};
}

http.listen(PORT, function () {
	console.log('Server listening on port ' + PORT);
});
