#! /usr/bin/env node
var argv = require('yargs')
    .usage('Usage: add-token -team [string] -token [string]')
    .demand(['team', 'token'])
    .argv;
console.log(argv.team, argv.token);
var fs = require('fs');
var setup = require('../setup.json'),
    tokens = setup.tokens;

if (!tokens) tokens = { };
tokens[argv.team] = argv.token;

setup.tokens = tokens;

fs.writeFile('./setup.json', JSON.stringify(setup), function (err) {
    if (err) return console.log(err);
    console.log('Token added succcessgully to setup.');
})
