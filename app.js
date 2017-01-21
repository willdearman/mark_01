// Local files required
require('./keys_private.js');
var prompts = require('./prompts');
var builder = require('botbuilder');
var data = require('./entityToTicker');

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

// -- ?
/** Use CrunchBot LUIS model for the root dialog. */
var model = process.env.model 
//|| 'https://api.projectoxford.ai/luis/v1/application?id=56c73d36-e6de-441f-b2c2-6ba7ea73a1bf&subscription-key=6d0966209c6e4f6b835ce34492f3e6d9&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

//=========================================================
// Root Dialogs
//=========================================================
// From multiturn example
/*
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Answer acquisition related questions like "how many companies has microsoft bought?"
dialog.matches('Acquisitions', [askCompany, answerQuestion('acquisitions', prompts.answerAcquisitions)]);

// Answer help related questions like "what can I say?" 
dialog.matches('Help', builder.DialogAction.send(prompts.helpMessage));
dialog.onDefault(builder.DialogAction.send(prompts.helpMessage));

// 
// This function the first step in the waterfall for intent handlers. It will use the company mentioned
// in the users question if specified and valid. Otherwise it will use the last company a user asked 
// about. If it the company is missing it will prompt the user to pick one. 
 //
function askCompany(session, args, next) {
    // First check to see if we either got a company from LUIS or have a an existing company
    // that we can multi-turn over.
    var company;
    var entity = builder.EntityRecognizer.findEntity(args.entities, 'CompanyName');
    if (entity) {
        // The user specified a company so lets look it up to make sure its valid.
        // * This calls the underlying function Prompts.choice() uses to match a users response
        //   to a list of choices. When you pass it an object it will use the field names as the
        //   list of choices to match against. 
        company = builder.EntityRecognizer.findBestMatch(data, entity.entity);
    } else if (session.dialogData.company) {
        // Just multi-turn over the existing company
        company = session.dialogData.company;
    }
    
    // Prompt the user to pick a ocmpany if they didn't specify a valid one.
    if (!company) {
        // Lets see if the user just asked for a company we don't know about.
        var txt = entity ? session.gettext(prompts.companyUnknown, { company: entity.entity }) : prompts.companyMissing;
        
        // Prompt the user to pick a company from the list. They can also ask to cancel the operation.
        builder.Prompts.choice(session, txt, data);
    } else {
        // Great! pass the company to the next step in the waterfall which will answer the question.
        // * This will match the format of the response returned from Prompts.choice().
        next({ response: company })
    }
}

// This function generates a generic answer step for an intent handlers waterfall. The company to answer
// a question about will be passed into the step and the specified field from the data will be returned to 
// the user using the specified answer template. 
 
function answerQuestion(field, answerTemplate) {
    return function (session, results) {
        // Check to see if we have a company. The user can cancel picking a company so IPromptResult.response
        // can be null. 
        if (results.response) {
            // Save company for multi-turn case and compose answer            
            var company = session.dialogData.company = results.response;
            var answer = { company: company.entity, value: data[company.entity][field] };
            session.send(answerTemplate, answer);
        } else {
            session.send(prompts.cancel);
        }
    };
}
*/

//=========================================================
// Will original code
bot.dialog('/', 
  [
    function (session, args, next) {
        session.send(prompts.welcomeMessage);
        session.beginDialog('/askCompany', args);
    },function (session, args, next) {
        session.beginDialog('/getTickerPrice');
    },function (session, args, next) {
        console.log(session.privateConversationData['entity1quotes'])
        session.send("The closing price was %(close)s for %(symbol)s on %(date)s", session.privateConversationData['entity1quotes']);
        session.beginDialog('/getTickerNews');
    },function (session, args, next) {
        session.send("Recent company news includes");
        console.log(session.privateConversationData['entity1news'])
        session.send("%(title)s", session.privateConversationData['entity1news']);
        session.endConversation("Goodbye!");
    }
  ]);

//=========================================================
// Specialized Dialogs
//=========================================================
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

bot.dialog('/askCompany', [function askCompany(session, args, next) {
    // First check to see if we either got a company from LUIS or have a an existing company
    // that we can multi-turn over.
    var args = {};

    var company;

    var entity = builder.EntityRecognizer.findEntity(args.entities, 'CompanyName');
    if (entity) {
        // The user specified a company so lets look it up to make sure its valid.
        // * This calls the underlying function Prompts.choice() uses to match a users response
        //   to a list of choices. When you pass it an object it will use the field names as the
        //   list of choices to match against. 
        company = builder.EntityRecognizer.findBestMatch(data, entity.entity);
    } else 
    if (session.dialogData.company) {
        // Just multi-turn over the existing company
        company = session.dialogData.company;
    }
    
    // Prompt the user to pick a ocmpany if they didn't specify a valid one.
    if (!company) {
        // Lets see if the user just asked for a company we don't know about.
        var txt = entity ? session.gettext(prompts.companyUnknown, { company: entity.entity }) : prompts.companyMissing;
        
        // Prompt the user to pick a company from the list. They can also ask to cancel the operation.
        builder.Prompts.choice(session, txt, data);
    } else {
        // Great! pass the company to the next step in the waterfall which will answer the question.
        // * This will match the format of the response returned from Prompts.choice().
        next({ response: company })
    }
}]);

function answerQuestion(field, answerTemplate) {
    return function (session, results) {
        // Check to see if we have a company. The user can cancel picking a company so IPromptResult.response
        // can be null. 
        if (results.response) {
            // Save company for multi-turn case and compose answer            
            var company = session.dialogData.company = results.response;
            var answer = { company: company.entity, value: data[company.entity][field] };
            session.send(answerTemplate, answer);
        } else {
            session.send(prompts.cancel);
        }
    };
}

// TO DO: Search and disambiguate ticker symbols

// TO DO: Context to ask further
  // Change between two dates
  // Difference between tickers
  // Performance during event

// TO DO: Ability to cancel dialog

// TO DO: Event resource

// Intent matches
/*
matches(/^change city to (.*)/i, function (session, args) {
        // change default city
        var newCity = args.matched[1].trim();
        session.conversationData[CityKey] = newCity;
        var userName = session.userData[UserNameKey];
        session.send('All set %s. From now on, all my searches will be for things in %s.', userName, newCity);

    })
*/




