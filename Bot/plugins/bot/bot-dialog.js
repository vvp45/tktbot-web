var bot = require("./bot").bot;
var recognizer = require("./bot").recognizer;
var db = require("../../core/db/dbconnector"); //OrintDb setup
const builder = require('botbuilder');
var Store = require('./store');

bot.recognizer(recognizer);
//var clg_name = builder.EntityRecognizer.findEntity(args.intent.entities, 'clg_name');

exports.default = function () {


    bot.dialog('greetings', [(session, args, next) => {
        const botName = 'TKIET Bot';
        const description = "I'm a Bot who can provide you information about College and Admission process!";

        session.send(`Hi there! I'm ${botName}`);
        session.send(`In short, here's what I can do:\n\n${description}`);

        builder.Prompts.text(session,`What's your name?`);
    },
    (session, result, next) => {
        session.endConversation(`Welcome, ${result.response}`);
    }]).triggerAction({
    matches: 'Greetings'
    });

    bot.dialog('/api/messages', function (session) {
        session.send("Hello World");
    });    
   
    
    bot.dialog('help',(session) =>{
        session.endDialog(`Hi! Try asking me things like \'tell me about TKIET\', \'tell me last years result\' or \'show me the reviews of The TKIET Bot \'!`);
    }).triggerAction({
        matches: 'Help',
        onSelectAction: (session, args) => {
            session.beginDialog(args.action, args);
        }
    });
    
    bot.dialog('developers',(session) =>{

        session.endDialog(`\n\nThese are the developers.'\n`);        
            db.query("select First_Name from user").then(
                function (result) {
                console.log("query result received");
                console.log(result);
                var a;
                var dev="";
                for(a=0; a<result.length;a++)
                {
                  dev += result[a].First_Name+",\n";
                }
                
                session.send(dev+';');
            }
        )
    }).triggerAction({
        matches: 'developers',
        onSelectAction: (session, args) => {
            session.beginDialog(args.action, args);
        }
    });
    
    bot.dialog('department',[
        (session ,args, next) =>{
            builder.Prompts.text(session,'Which department you are intrested in?');
            
        },
        (session, result, next) => {
            session.endConversation(`Alright, Lets talk about ${result.response} department!`);
        },
        (session ,args, next) =>{
            session.beginDialog('cse');
            //pass control to specific department in this case cse
            //when new diaglog completes, return control here. 
        }
    ]).triggerAction({
        matches: 'department',
        onSelectAction: (session, args) => {
            session.beginDialog(args.action, args);
        }
    }); 
    
    bot.dialog('cse',[
        (session ,args, next) =>{
                builder.Prompts.text(session,'What do you want to know about CSE department?');
        },
        (session, result, next) => {
                const department = result.response;
                session.endDialogWithResult({response: department});
        },
    ]);

    bot.dialog('hod',(session) =>{
        db.query("select Information from CSE where Keyword = 'HOD'").then(
            function (result) {
            console.log("query result received");
            console.log(result);
            session.send(result[0].Information+"\n");
            })
        }).triggerAction({
        matches: /hod/i,
        onSelectAction: (session, args) => {
            session.beginDialog(args.action, args);
        }
    });

    bot.dialog('ShowBotReviews', function (session, args) {
        // retrieve hotel name from matched entities
       // var botEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'depatment');
            session.send('Looking for reviews of this application ...');
            Store.searchBotReviews()
                .then(function (reviews) {
                    var message = new builder.Message()
                        .attachmentLayout(builder.AttachmentLayout.carousel)
                        .attachments(reviews.map(reviewAsAttachment));
                    session.endDialog(message);
                });
    }).triggerAction({
        matches: 'ShowBotReviews'
    });
}

bot.dialog('admission', [
    function (session, args, next) {
       // session.send(' We are analyzing your message: \'%s\'', session.message.text);

        // try extracting entities
        var admitdoc = builder.EntityRecognizer.findEntity(args.intent.entities, 'doc_required');
        var admitdate = builder.EntityRecognizer.findEntity(args.intent.entities, 'admission_date');
        var admitloc = builder.EntityRecognizer.findEntity(args.intent.entities, 'admission_location');
        var officetime = builder.EntityRecognizer.findEntity(args.intent.entities, 'time');
        var cutoff = builder.EntityRecognizer.findEntity(args.intent.entities, 'cutoff');

        if (admitdoc) {
            db.query("select Information from Admission where Keyword = 'Documents'").then(
                function (result) {
                console.log("query result received");
                console.log(result);
                session.send(result[0].Information+"\n");
                })
        } else if (admitdate) {
            db.query("select Information from Admission where Keyword = 'Admission_Date'").then(
                function (result) {
                console.log("query result received");
                console.log(result);
                session.send(result[0].Information+"\n");
                })
        }else if (admitloc) {
            db.query("select Information from College where Keyword = 'location'").then(
                function (result) {
                console.log("query result received");
                console.log(result);
                session.send(result[0].Information+"\n");
                })
    }   else if (officetime) {
            db.query("select Information from Admission where Keyword = 'officetime'").then(
                function (result) {
                console.log("query result received");
                console.log(result);
                session.send(result[0].Information+"\n");
                })
        }else if (cutoff) {
            db.query("select Information from Admission where Keyword = 'CuttOff'").then(
                function (result) {
                console.log("query result received");
                console.log(result);
                session.send(result[0].Information+"\n");
                })
        }
    }
]).triggerAction({
    matches: 'admission',
    onInterrupted: function (session) {
        session.send('Please provide a destination');
    }
});

function reviewAsAttachment(review) {
    return new builder.ThumbnailCard()
        .title(review.title)
        .text(review.text)
        .images([new builder.CardImage().url(review.image)]);
}