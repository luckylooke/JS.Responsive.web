/**
 * Created by lucky on 07/10/16.
 */

var fs = require('fs');
var cheerio = require('cheerio');
fs.readdir('./JS.Responsive/docs', function(err, files) {
    if(err) console.error(err);

    files
        .filter(function(file) { return file.substr(-5) === '.html'; }) // html only
        .forEach(function(file) {
            fs.readFile(__dirname + '/JS.Responsive/docs/' + file, 'utf-8', function(err, contents) {
                console.log('file contents: ', file, !!contents);
                file = file.replace('.js', 'js');
                if(!contents)
                    return;
                contents = contents.replace(/(href=")([\w\-.]+)(\.html")/g, function(match, p1, p2){
                    "use strict";
                    console.log('match: ', match, 'p1: ', p1, 'p2: ', p2, p2.indexOf('.js'));
                    return p1 + '/documentation/' + p2.replace('.js', 'js') + '/"';
                });
                var $ = cheerio.load(contents);
                $('script').remove();
                contents = $('body').html();
                fs.writeFile(__dirname + '/views/docs/' + file, contents, function(err){
                    "use strict";
                    if(err) console.error(err);

                    console.log('file done: ', file);
                });
            });
        });
});

// temp fixes:
fs.readFile(__dirname + '/JS.Responsive/docs/scripts/toc.js', 'utf-8', function(err, contents) {
    if (err) console.error(err);
    if(contents.search(';var timeout;') != -1)
        return;
    contents = contents.replace('var timeout;', ';var timeout;');
    fs.writeFile(__dirname + '/JS.Responsive/docs/scripts/toc.js', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', './JS.Responsive/docs/scripts/toc.js');
    });
});
fs.readFile(__dirname + '/JS.Responsive/docs/scripts/fulltext-search-ui.js', 'utf-8', function(err, contents) {
    if (err) console.error(err);
    if(contents.search(';resultsList.appendChild') != -1)
        return;
    contents = contents.replace('resultsList.appendChild', ';resultsList.appendChild');
    contents = contents.replace('link.href = result.id;', 'link.href = "/documentation/" + result.id.replace(".html","");');
    contents = contents.replace('quickSearch.attr("src", "quicksearch.html");', 'quickSearch.attr("src", "/documentation/quicksearch.html");');
    fs.writeFile(__dirname + '/JS.Responsive/docs/scripts/fulltext-search-ui.js', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', './JS.Responsive/docs/scripts/fulltext-search-ui.js');
    });
});
fs.readFile(__dirname + '/JS.Responsive/node_modules/jsdoc-webpack-plugin/index.js', 'utf-8', function(err, contents) {
    if (err) console.error(err);
    if(contents.search("spawn(__dirname + '/node_modules/.bin/jsdoc'") != -1)
        return;
    contents = contents.replace("spawn('./node_modules/.bin/jsdoc'", "spawn(__dirname + '/node_modules/.bin/jsdoc'");

    fs.writeFile(__dirname + '/JS.Responsive/node_modules/jsdoc-webpack-plugin/index.js', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', './JS.Responsive/docs/scripts/fulltext-search-ui.js');
    });
});