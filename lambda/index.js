'use strict';
process.setMaxListeners(0);
const Alexa = require('alexa-sdk');
const APP_ID = 'ALEXA_SKILLS_ID';  
const log = require('lambda-log');
const WebSocket = require('ws');

const welcomeOutput = 'Welcome to My PowerPoint';
const welcomeReprompt = 'I can guide you to use PowerPoint.';

let speechOutput;

const handlers = {
    'LaunchRequest': function () {
      this.response.speak(welcomeOutput).listen(welcomeReprompt);
      this.emit(':responseReady');
    },
    'pptnextslide': function () {
		let myHandler = this;
		let reprompt;

		let ws = new WebSocket('wss://fdwebsocket.herokuapp.com/');
		ws.on('open', function open() {
			ws.send('next');
			ws.close();

			speechOutput = 'Ok, going to next slide';
			myHandler.response.speak(speechOutput);
			myHandler.emit(':responseReady');
		});
	
    },
	'pptprevslide': function () {
		let myHandler = this;
		let reprompt;

		let ws = new WebSocket('wss://fdwebsocket.herokuapp.com/');
		ws.on('open', function open() {
			ws.send('previous');
			ws.close();
			
			speechOutput = 'Ok, going to previous  slide';
			myHandler.response.speak(speechOutput);
			myHandler.emit(':responseReady');
		});		
    },
	'ppttoslide': function () {
		let myHandler = this;
		let reprompt;

        let slidenumber = isSlotValid(this.event.request, 'slidenumber');
		let ws = new WebSocket('wss://fdwebsocket.herokuapp.com/');
		ws.on('open', function open() {
			ws.send('slide=' + slidenumber);
			ws.close();

			speechOutput = 'Ok, going to slide ' + slidenumber;
			myHandler.response.speak(speechOutput);
			myHandler.emit(':responseReady')
		});
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = '';
        reprompt = '';
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = '';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        speechOutput = '';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        let speechOutput = '';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handler = (event, context) => {
	log.config.meta.event = event;
	log.config.tags.push(event.env);
	log.info('my lambda function is running!');
    let alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function isSlotValid(request, slotName){
	let slot = request.intent.slots[slotName];
    let slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
		//we have a value in the slot
        slotValue = slot.value.toLowerCase().trim();
		return slotValue;
	} else {
		//we didn't get a value in the slot.
        return false;
    }
}
