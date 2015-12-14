var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	console.log('New Message:');
	console.log(message.text);
	
	jQuery('.messages').append('<p>' + message.text + '</p>');
});

// handles submiitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	//
	event.preventDefault();
	
	var $message = $form.find('input[name=message]');
	
	console.log('sending: ' + $message.val());
	socket.emit('message', {
		text: $message.val()
	});
	
	//
	$message.val('');
});