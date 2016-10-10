/**
 * Created by lucky on 07/10/16.
 */

var fs = require('fs');
var cheerio = require('cheerio');
var html = fs.readFileSync('./JS.Responsive/docs/index.html', 'utf8');
html = html.replace(/(href=")([A-Za-z0-9\-.]+")/g, function(match, p1, p2){
    "use strict";
    console.log('match: ', match);
    return p1 + 'documentation/' + p2;
});
var $ = cheerio.load(html);
var body = $('body').html();
fs.writeFileSync('./views/jsdocParsed.html', body, 'utf8');
