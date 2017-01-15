var restify = require('restify');
var builder = require('botbuilder');
var googleFinance = require('google-finance');
//var yahooFinance = require('yahoo-finance');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    //appId: process.env.MICROSOFT_APP_ID,
    //appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var SYMBOL = 'NASDAQ:AAPL';
var FROM = '2014-01-01';
var TO = '2014-12-31';
var util = require('util');



bot.dialog('/', function (session) {
  session.send("Response is coming");
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
  	session.sendTyping('Closing price is %s', JSON.stringify(quotes[0].close, null, 2));
    //console.log(
    //  '%s\n...\n%s',
    //  JSON.stringify(quotes[0], null, 2),
    //  JSON.stringify(quotes[quotes.length - 1], null, 2)
    //);
  } else {
    console.log('N/A');
  }
});

});





