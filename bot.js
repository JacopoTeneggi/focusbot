var argv = require('yargs')
    .usage('Usage: node . -team [string]')
    .argv;
var setup = require('./setup.json'),
    tokens = setup.tokens;

var token = null;
if (!argv.team) {
    if (Object.keys(tokens).length == 0) {
        console.log('Please run add-team to store a Slack Bot Integration token.');
        process.abort();
    }
    for (var team in tokens) {
        if (tokens[team]) token = tokens[team];
        break;
    }
} else token = tokens[argv.team];
console.log(token);
var botkit = require('botkit');
var controller = botkit.slackbot();
var bot = controller.spawn({
    token: token
})
bot.startRTM(function (err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});

controller.hears(["Hi"], ["direct_message", "direct_mention", "mention", "ambient"], function (bot, message) {
    bot.reply(message, "Say 'I need to focus' to let me wake you every 10 mins, then answer me 'yes' or 'done'. Enjoy 0.0.1 folks!");
});

controller.hears(["I need to focus"], ["direct_message", "direct_mention", "mention", "ambient"], function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.ask("Are you still there?", [
            {
                pattern: bot.utterances.yes,
                callback: function (response, convo) {
                    setTimeout(function () {
                        convo.repeat();
                        convo.next();
                    }, 60000 * 10);
                }
            },
            {
                pattern: 'done',
                callback: function (respose, convo) {
                    convo.say("I hope you had a really focus time!");
                    convo.next();
                }
            }
        ]);
    });
});