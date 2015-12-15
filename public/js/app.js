var socket = io();

var userName = getQueryVariable('name') || 'Anonymous';
var chatRoom = getQueryVariable('room');

console.log(userName + ' is logged into ' + chatRoom + '...');

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');
	console.log('New Message:  ');
	console.log(message.text);
	
	$message.append('<p>[' + momentTimestamp.local().format('h:mm:ss a') + ']  ' + userName);
	$message.append('<p>' + message.text + '</p>');
});

// handles submiitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	//
	event.preventDefault();
	
	var $message = $form.find('input[name=message]');
	var $timeStamp = moment().format('x');
	
	console.log('sending: ' + $message.val());
	socket.emit('message', {
		text: $message.val(),
		timestamp: $timeStamp
	});
	
	//
	$message.val('');
});

function getTimeString (timestamp) {
	var ts = timestamp;
	if (typeof(timestamp) === 'string') {
		ts = parseInt(timestamp);
	} 
	
	return moment.utc(ts).local().format('h:mm:ss a');
}