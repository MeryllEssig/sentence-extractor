#!/usr/bin/env node

var exec = require("child_process").exec;
var lngDetector = require("languagedetect");
var lng = new lngDetector();
var args = require('args');

args
    .option('lang', 'Language of the sentences to extract', "french")
    .option('max-chars', 'Max characters per sentence', 100)
    .option('min-words', 'Min words per sentence', 3)
    .option('max-words', 'Max words per sentence', 14)
    .option('file', 'File to extract sentences from.')
    .option('display-stats', 'Display stats', false);
;


var exit_error = function(error) {
    console.error("Fatal error: " + error);
    process.exit(1);
}

const flags = args.parse(process.argv);
const lang = flags.lang || "french";
const maxChars = flags.maxChars || 100;
const minWords = flags.minWords || 3;
const maxWords = flags.maxWords || 14;
const file = flags.file || exit_error("No file was provided");
const displayStats = flags.displayStats || false;


function wordCount(str) {
    return str.split(" ").filter(function(n) {
        return n !== '';
    }).length;
}

function testTwoUpperCaseConsecutiveChars(str) {
    var count = 0, len = str.length;
    for(var i = 0; i < len; i++) {
        if(/[A-Z]/.test(str.charAt(i))) count++;
        if(/[a-z]/.test(str.charAt(i))) 
            count = 0;
        if(count > 1) return true;
    }
    return false;
}

function execute(cmd, cb) {
    exec(cmd, { maxBuffer: 1024 * 2500 }, function(err, out, stderr) {
        return cb(out);
    });
}

execute('cat "' + file + '" | sentence-splitter', function(out) { 
    
        sentences = out.replace(/[\n\r]+/g, ' ').replace(/\s{2,10}/g, " ").split(/Sentence\s\d+:\s/);
        
        var notallowed = require('./filters.js');

        for (var i = 0; i < sentences.length; i++) {
            if(notallowed.some(function(v) { return sentences[i].indexOf(v) >= 0})) {
                sentences.splice(i, 1);
                i--;
                continue;
            }

            var count = (sentences[i].split(".").length -1) + (sentences[i].split("?").length -1) + (sentences[i].split("!").length -1);
            if(count > 1) {
                sentences.splice(i, 1);
                i--;
                continue;
            }
            if(testTwoUpperCaseConsecutiveChars(sentences[i])) {
                sentences.splice(i, 1);
                i--;
                continue;
            }

            if(wordCount(sentences[i]) < minWords || wordCount(sentences[i]) > maxWords || sentences[i].length > maxChars) {
                sentences.splice(i, 1);
                i--;
                continue;
            }
            if(lng.detect(sentences[i])[0][0] !== lang) {
                sentences.splice(i, 1);
                i--;
                continue;
            }
            

            sentences[i] = sentences[i].charAt(0).toUpperCase() + sentences[i].slice(1);        
        }

        for(var i = 0; i < sentences.length; i++) {
            console.log(sentences[i]);
        }
        if(displayStats) {
            console.log("Nombre de phrases: " + sentences.length);
            console.log("Max chars: " + maxChars);
            console.log("Max words: " + maxWords);
            console.log("Min words: " + minWords);
        }
        
    }
);
