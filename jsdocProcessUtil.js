/**
 * Created by lucky on 07/10/16.
 */

var fs = require('fs');
var cheerio = require('cheerio');
var listOfModules = '';
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
                    // console.log('match: ', match, 'p1: ', p1, 'p2: ', p2, p2.indexOf('.js'));
                    return p1 + '/documentation/' + p2.replace('.js', 'js') + '/"';
                });
                contents = contents.replace("col-md-3", "");
                contents = contents.replace("col-md-8", "col-md-12");
                contents = contents.replace("pull-right icon-plus-sign icon-white", "caret");

                var $ = cheerio.load(contents);
                $('script').remove();
                var toc = $('#toc-content');
                var tocHtml = toc.html();
                toc
                    .removeClass('container')
                    .html('')
                    .append('<div class="container"></div>>')
                    .find('.container')
                        .html(tocHtml);
                var h1 = $('h1');
                if(h1.length){
                    toc.before(h1);
                }
                var h2 = $('h2');
                if(h2.length){
                    toc.before(h2);
                    $('header').remove();
                }
                if(file == 'index.html'){
                    listOfModules = $('.dropdown-menu').eq(0).html();
                    fs.readFile(__dirname + '/views/docSubMenu.html', 'utf-8', function(err, contents) {
                        console.log('file contents: ', 'docSubMenu.html', !!contents);
                        var $ = cheerio.load(contents);
                        $('#modules-list').html(listOfModules);
                        contents = $.html();
                        fs.writeFile(__dirname + '/views/docSubMenu.html', contents, function(err){
                            if(err) console.error(err);
                            console.log('file done: ', file);
                        });
                    });
                }
                $('.navbar').remove();

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
fs.readFile(__dirname + '/views/docs/index.html', 'utf-8', function(err, contents) {
    if (err) console.error(err);
    if(contents.search('<div id="main"> @{view("indexDocs")}') != -1)
        return;
    contents = contents.replace('<div id="main">', '<div id="main"> @{view("indexDocs")}');
    fs.writeFile(__dirname + '/views/docs/index.html', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', '/views/docs/index.html');
    });
});
fs.readFile(__dirname + '/JS.Responsive/docs/scripts/fulltext-search-ui.js', 'utf-8', function(err, contents) {
    if (err) console.error(err);
    if(contents.search(';resultsList.appendChild') != -1)
        return;
    contents = contents.replace('resultsList.appendChild', ';resultsList.appendChild');
    contents = contents.replace('link.href = result.id;', 'link.href = "/documentation/" + result.id.replace(".html","").replace(".js","js");');
    contents = contents.replace('quickSearch.attr("src", "quicksearch.html");', 'quickSearch.attr("src", "/documentation/quicksearch.html");');
    fs.writeFile(__dirname + '/JS.Responsive/docs/scripts/fulltext-search-ui.js', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', './JS.Responsive/docs/scripts/fulltext-search-ui.js');
    });
});
fs.readFile(__dirname + '/JS.Responsive/node_modules/jsdoc-webpack-plugin/index.js', 'utf-8', function(err, contents) {
    if (err) console.error(err);
    if(contents.search("spawn\\(__dirname + '/node_modules/.bin/jsdoc'") != -1)
        return;
    contents = contents.replace("spawn('./node_modules/.bin/jsdoc'", "spawn(__dirname + '/node_modules/.bin/jsdoc'");

    fs.writeFile(__dirname + '/JS.Responsive/node_modules/jsdoc-webpack-plugin/index.js', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', './JS.Responsive/docs/scripts/fulltext-search-ui.js');
    });
});