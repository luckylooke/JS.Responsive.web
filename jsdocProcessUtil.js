/**
 * Created by lucky on 07/10/16.
 */

var fs = require('fs');
var cheerio = require('cheerio');
var listOfModules = '';
var opened = 0;
fs.readdir('./JS.Responsive/docs', function(err, files) {
    if(err) console.error(err);

    files
        .filter(function(file) { return file.substr(-5) === '.html'; }) // html only
        .forEach(function(file) {
            fs.readFile(__dirname + '/JS.Responsive/docs/' + file, 'utf-8', function(err, contents) {
                opened++;
                console.log('file has content: ', file, !!contents);
                file = file.replace('.js', 'js');
                if(!contents)
                    return;
                contents = contents.replace(/(href=")([\w\-.]+)(\.html)(#sunlight-1-line-\d+)?"/g, function(match, p1, p2, p3, p4){
                    "use strict";
                    // console.log('match: ', match, 'p1: ', p1, 'p2: ', p2, p2.indexOf('.js'));
                    return p1 + '/documentation/' + p2.replace('.js', 'js') + '/' + (p4 || '') + '"';
                });

                var $ = cheerio.load(contents, {decodeEntities: false});
                if(file == 'index.html'){
                    listOfModules = $('.dropdown-menu').eq(0).html();
                    fs.readFile(__dirname + '/views/docSubMenu.html', 'utf-8', function(err, contents) {
                        if(err) return console.error(err);
                        console.log('file contents: ', 'docSubMenu.html', !!contents);
                        var $ = cheerio.load(contents, {decodeEntities: false});
                        $('#modules-list').html(listOfModules);
                        contents = $.html();
                        fs.writeFile(__dirname + '/views/docSubMenu.html', contents, function(err){
                            if(err) console.error(err);
                            console.log('file done: ', file);
                        });
                    });
                }

                contents = $.html();

                if(file.match(/\.list.html$/))
                    file = file.replace('.list', '-list');

                if(file === 'JS.Responsive.html')
                    fs.writeFile(__dirname + '/views/docs/js.responsive.html', contents, function(err){
                        "use strict";
                        if(err) console.error(err);

                        console.log('file done:  js.responsive.html');
                        opened--;
                        if(!opened){
                            afterAllCreated();
                        }
                    });

                if(file === 'JS.Responsive.sourcejs.html')
                    fs.writeFile(__dirname + '/views/docs/js.responsive.sourcejs.html', contents, function(err){
                        "use strict";
                        if(err) console.error(err);

                        console.log('file done:  js.responsive.sourcejs.html');
                        opened--;
                        if(!opened){
                            afterAllCreated();
                        }
                    });

                fs.writeFile(__dirname + '/views/docs/' + file, contents, function(err){
                    "use strict";
                    if(err) console.error(err);

                    console.log('file done: ', file);
                    opened--;
                    if(!opened){
                        afterAllCreated();
                    }
                });
            });
        });
});

function afterAllCreated(){
    "use strict";
    // temp fixes:
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
}