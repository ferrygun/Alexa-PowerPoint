'use strict'

let ss = require('slideshow');
let slideshow = new ss("powerpoint");
let pptfilename = 'AlexaPPT.pptx';

slideshow.boot()
.then(function () { slideshow.open(pptfilename) })

const WebSocket = require('ws');
//const ws = new WebSocket("ws://localhost:3000/");
const ws = new WebSocket("wss://fdwebsocket.herokuapp.com/");

ws.on('message', function(message) {
	console.log('Received: ' + message);

	if(message.indexOf("next") !== -1) {
		console.log('next slide');
		slideshow.boot()
		.then(function () { slideshow.start() })
		.then(function () { slideshow.next() })
	}

	if(message.indexOf("previous") !== -1) {
		console.log('previous slide');
		slideshow.boot()
		.then(function () { slideshow.start() })
		.then(function () { slideshow.prev() })
	}

	if(message.indexOf("slide") !== -1) {
		let slideno = message.split('=')[1];
		console.log("go to slide: " + slideno);
		slideshow.boot()
		.then(function () { slideshow.start() })
		.then(function () { slideshow.goto(slideno) })
	}

});

ws.on('close', function(code) {
	console.log('Disconnected: ' + code);
});

ws.on('error', function(error) {
	console.log('Error: ' + error.code);
});


ws.on('open', function open() {
	setInterval(() => {
		ws.send('PING', console.log.bind(null, 'Sent : ', 'PING'));
	}, 1000);
});
