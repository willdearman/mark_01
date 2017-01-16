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
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Greetings.");
    session.beginDialog('/origin');
});


//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/origin', [
    function (session) {
        session.send(prompts.welcomeMessage);
        session.beginDialog('/getTickerPrice');
    },function (session) {
        console.log(session.privateConversationData['entity1quotes'])
        session.send("The closing price was %(close)s for %(symbol)s on %(date)s", session.privateConversationData['entity1quotes']);
        session.beginDialog('/getTickerNews');
    },function (session, next) {
        session.send("Recent company news includes");
        console.log(session.privateConversationData['entity1news'])
        session.send("%(title)s", session.privateConversationData['entity1news']);
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

        googleFinance.historical({symbol: SYMBOL, from: FROM, to: TO}).then(function (quotes) 
    {
          console.log(quotes[0])
          session.privateConversationData['entity1quotes'] = quotes[0]
          session.endDialog();
    })
  }
]);

bot.dialog('/getTickerNews', [
    function (session, news)  {
        var SYMBOL = 'NASDAQ:AAPL';
        //builder.Prompts.text(session, 'Hi! What is your name?');
        session.send("Obtaining news value");
        googleFinance.companyNews({symbol: SYMBOL}).then(function (news) 
    {
          console.log(news[0])
          session.privateConversationData['entity1news'] = news[0]
          session.endDialog();
    })
  }
]);




