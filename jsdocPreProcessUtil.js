/**
 * Created by lucky on 07/10/16.
 */

var fs = require('fs');
// var cheerio = require('cheerio');


fs.readFile(__dirname + '/JS.Responsive/jsdoc.json', 'utf-8', function(err, contents) {
    if (err) console.error(err);
    if(contents.search('"template": "./node_modules/ink-docstrap/template",') == -1)
        return;
    contents = contents.replace('"template": "./node_modules/ink-docstrap/template",', '"template": "' + __dirname + '/JS.Responsive.jsdocTmpl/template",');

    fs.writeFile(__dirname + '/JS.Responsive/jsdoc.json', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', './JS.Responsive/jsdoc.json');
    });
});