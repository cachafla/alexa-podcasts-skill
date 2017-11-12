const Alexa = require('alexa-sdk');
const audioEventHandlers = require('./audioEventHandlers');
const handlers = require('./handlers');

exports.handler = (event, context, callback) => {
    console.log('\n' + JSON.stringify(event, null, 2));

    const alexa = Alexa.handler(event, context, callback);

    // Replace with your appId
    alexa.appId = 'amzn1.ask.skill.123';

    alexa.registerHandlers(handlers, audioEventHandlers);
    alexa.execute();
};
