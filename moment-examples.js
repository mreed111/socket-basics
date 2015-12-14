var moment = require('moment');

var now = moment();

//now.subtract(1,'year');

console.log(now.format());
console.log(now.format('X'));
console.log(now.format('x'));
//console.log(now.format('MMM Do YYYY, h:mm a')); // Dec 14th 2015, 6:45 pm

var timestamp = 1450125500301;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('h:mm a'));  // 12:30 pm


console.log('current local time is: ' + moment.utc(parseInt(now.format('x'))).local().format('h:mm a ZZ') );

