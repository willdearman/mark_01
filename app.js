require('./keys_private.js');
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

bot.dialog('/', function (session) {
  session.send("Response is coming");

  // Symbol historical lookup example
  var SYMBOL = 'NASDAQ:AAPL';
  var FROM = '2014-01-01';
  var TO = '2014-12-31';
  var util = require('util');

  googleFinance.historical({
    symbol: SYMBOL,
    from: FROM,
    to: TO
  }).then(function (quotes) {
    console.log(util.format(
      '=== %s (%d) ===',
      SYMBOL,
      quotes.length
    ).cyan);
    if (quotes[0]) {
    	var msg = new builder.Message()
        .text(JSON.stringify(quotes[0].close, null, 2));
      session.send(msg)
    } else {
      console.log('N/A');
    }
  });
session.endConversation("That is all.")
});





