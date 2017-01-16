// Local files required
require('./keys_private.js');
var prompts = require('./prompts');

// Node.js requirements
var https = require('https'); 
var restify = require('restify');
var builder = require('botbuilder');
var googleFinance = require('google-finance');
//var yahooFinance = require('yahoo-finance');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [
    function (session) {
        session.send(prompts.welcomeMessage);
        session.send("Value is coming");
        session.beginDialog('/getTickerPrice');
    },function (session) {
      console.log(session.privateConversationData['entity1'])
        session.send("The price is %(close)s for %(symbol)s", session.privateConversationData['entity1']);
    },function (session) {
        session.endConversation("Goodbye!");
    }
]);

//var userCity = session.privateConversationData['entity1']
// Specialized Dialogs

bot.dialog('/getTickerPrice', [
    function (session, quotes)  {
        var SYMBOL = 'NASDAQ:AAPL';
        var FROM = '2014-01-01';
        var TO = '2014-12-31';
        //builder.Prompts.text(session, 'Hi! What is your name?');
        session.send("Obtaining value");
        googleFinance.historical({symbol: SYMBOL, from: FROM, to: TO}).then(function (quotes) 
    {
          console.log(quotes[0])
          session.privateConversationData['entity1'] = quotes[0]
          session.send("I have a value")
          session.endDialog();
    })
  }
]);




