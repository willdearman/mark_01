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
  	session.send('Closing price is %s', JSON.stringify(quotes[0].close, null, 2));
    //console.log(
    //  '%s\n...\n%s',
    //  JSON.stringify(quotes[0], null, 2),
    //  JSON.stringify(quotes[quotes.length - 1], null, 2)
    //);
  } else {
    console.log('N/A');
  }
});

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.endDialog(msg);

});





