var fs = require('fs');
var cheerio = require('cheerio');
var opened = 0;

fs.readdir(__dirname + '/views', function(err, files) {
    if (err) console.error(err);

    files
        .filter(function(file) { return file.substr(-5) === '.html'; }) // html only
        .forEach(function(file) {
            fs.readFile(__dirname + '/views/' + file, 'utf-8', function(err, contents) {
                opened++;
                console.log('file contents: ', file, !!contents);
                if(!contents)
                    return;

                var $ = cheerio.load(contents);

                $('*').contents().each(function (i, item) {
                    if(item.type === 'text' && item.data.match(/\w/)){
                        item.data = '@(' + item.data + ')';
                    }
                });

                contents = $.html();

                fs.writeFile(__dirname + '/views/' + file, contents, function(err){
                    "use strict";
                    if(err) console.error(err);

                    console.log('file done: ', file);
                    opened--;
                    if(!opened){
                        afterAllPassed();
                    }
                });
            });
        });
});

function afterAllPassed() {
    console.log('All DONE!');
}
