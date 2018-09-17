const builder = require('botbuilder');
require('dotenv-extended').load();
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);

const botHandler = connector.listen();
exports.bot = bot;
exports.recognizer = recognizer;
exports.botHandler = botHandler;